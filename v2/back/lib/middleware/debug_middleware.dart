import 'dart:convert';
import 'dart:io';
import 'package:shelf/shelf.dart';
import '../utils/logger.dart';

class DebugMiddleware {
  static Middleware requestLogger() {
    return (Handler innerHandler) {
      return (Request request) async {
        final stopwatch = Stopwatch()..start();
        final logger = Logger.instance;
        
        // Capturar informações da requisição
        final requestInfo = {
          'method': request.method,
          'url': request.requestedUri.toString(),
          'headers': Map<String, String>.from(request.headers),
          'userAgent': request.headers['user-agent'],
          'remoteAddress': _getClientIP(request),
          'timestamp': DateTime.now().toIso8601String(),
        };

        // Log da requisição recebida
        logger.debug('Requisição recebida', requestInfo);

        Response response;
        try {
          // Processar requisição
          response = await innerHandler(request);
          stopwatch.stop();

          // Log da resposta
          final responseInfo = {
            ...requestInfo,
            'statusCode': response.statusCode,
            'responseTime': stopwatch.elapsedMilliseconds,
            'contentLength': response.headers['content-length'],
          };

          logger.logRequest(
            request.method,
            request.requestedUri.path,
            response.statusCode,
            stopwatch.elapsedMilliseconds,
            {
              'userAgent': request.headers['user-agent'],
              'remoteAddress': _getClientIP(request),
            }
          );

          if (response.statusCode >= 400) {
            logger.warning('Resposta com erro', responseInfo);
          } else {
            logger.debug('Resposta enviada', responseInfo);
          }

        } catch (error, stackTrace) {
          stopwatch.stop();
          
          // Log do erro
          logger.error('Erro no processamento da requisição', {
            ...requestInfo,
            'error': error.toString(),
            'responseTime': stopwatch.elapsedMilliseconds,
          }, stackTrace);

          // Retornar resposta de erro
          response = Response.internalServerError(
            body: jsonEncode({
              'success': false,
              'error': 'Erro interno do servidor',
              'timestamp': DateTime.now().toIso8601String(),
              'requestId': _generateRequestId(),
            }),
            headers: {'Content-Type': 'application/json'},
          );
        }

        return response;
      };
    };
  }

  static Middleware errorHandler() {
    return (Handler innerHandler) {
      return (Request request) async {
        try {
          return await innerHandler(request);
        } catch (error, stackTrace) {
          final logger = Logger.instance;
          final requestId = _generateRequestId();
          
          logger.critical('Erro não capturado', {
            'requestId': requestId,
            'method': request.method,
            'url': request.requestedUri.toString(),
            'error': error.toString(),
            'userAgent': request.headers['user-agent'],
            'remoteAddress': _getClientIP(request),
          }, stackTrace);

          return Response.internalServerError(
            body: jsonEncode({
              'success': false,
              'error': 'Erro interno do servidor',
              'requestId': requestId,
              'timestamp': DateTime.now().toIso8601String(),
            }),
            headers: {'Content-Type': 'application/json'},
          );
        }
      };
    };
  }

  static Middleware performanceMonitor({int slowRequestThreshold = 1000}) {
    return (Handler innerHandler) {
      return (Request request) async {
        final stopwatch = Stopwatch()..start();
        final response = await innerHandler(request);
        stopwatch.stop();

        final responseTime = stopwatch.elapsedMilliseconds;
        
        if (responseTime > slowRequestThreshold) {
          Logger.instance.warning('Requisição lenta detectada', {
            'method': request.method,
            'url': request.requestedUri.toString(),
            'responseTime': responseTime,
            'threshold': slowRequestThreshold,
            'statusCode': response.statusCode,
          });
        }

        return response;
      };
    };
  }

  static String _getClientIP(Request request) {
    // Tentar obter IP real através de headers de proxy
    final xForwardedFor = request.headers['x-forwarded-for'];
    if (xForwardedFor != null) {
      return xForwardedFor.split(',').first.trim();
    }
    
    final xRealIP = request.headers['x-real-ip'];
    if (xRealIP != null) {
      return xRealIP;
    }

    // Fallback para IP da conexão
    try {
      final connectionInfo = request.context['shelf.io.connection_info'];
      if (connectionInfo != null) {
        return connectionInfo.toString();
      }
    } catch (e) {
      // Ignorar erro e usar fallback
    }
    
    return 'unknown';
  }

  static String _generateRequestId() {
    return DateTime.now().millisecondsSinceEpoch.toString() + 
           (1000 + (DateTime.now().microsecond % 9000)).toString();
  }
}

// Middleware para capturar body das requisições para debug
class RequestBodyCapture {
  static Middleware capture() {
    return (Handler innerHandler) {
      return (Request request) async {
        if (request.method == 'POST' || request.method == 'PUT' || request.method == 'PATCH') {
          try {
            final body = await request.readAsString();
            final logger = Logger.instance;
            
            // Log do body (cuidado com dados sensíveis)
            final sanitizedBody = _sanitizeBody(body);
            logger.debug('Request body capturado', {
              'method': request.method,
              'url': request.requestedUri.path,
              'bodyLength': body.length,
              'body': sanitizedBody,
            });

            // Recriar request com o body
            final newRequest = Request(
              request.method,
              request.requestedUri,
              body: body,
              headers: request.headers,
              context: request.context,
            );

            return await innerHandler(newRequest);
          } catch (e) {
            Logger.instance.warning('Erro ao capturar body da requisição', {
              'error': e.toString(),
              'method': request.method,
              'url': request.requestedUri.path,
            });
          }
        }
        
        return await innerHandler(request);
      };
    };
  }

  static String _sanitizeBody(String body) {
    try {
      final data = jsonDecode(body);
      if (data is Map<String, dynamic>) {
        // Remover campos sensíveis
        final sanitized = Map<String, dynamic>.from(data);
        const sensitiveFields = ['password', 'senha', 'token', 'secret', 'key'];
        
        for (final field in sensitiveFields) {
          if (sanitized.containsKey(field)) {
            sanitized[field] = '***REDACTED***';
          }
        }
        
        return jsonEncode(sanitized);
      }
    } catch (e) {
      // Se não for JSON válido, retornar truncado
      return body.length > 500 ? '${body.substring(0, 500)}...[TRUNCATED]' : body;
    }
    
    return body;
  }
}
