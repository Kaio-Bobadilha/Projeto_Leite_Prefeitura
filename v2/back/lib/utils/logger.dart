import 'dart:io';
import 'dart:convert';

enum LogLevel {
  debug(0, 'DEBUG'),
  info(1, 'INFO'),
  warning(2, 'WARN'),
  error(3, 'ERROR'),
  critical(4, 'CRITICAL');

  const LogLevel(this.level, this.name);
  final int level;
  final String name;
}

class Logger {
  static Logger? _instance;
  static Logger get instance => _instance ??= Logger._();
  
  Logger._();

  final String _logDir = '/home/ubuntu/projeto_leite_mvp/logs';
  late File _logFile;
  late File _errorFile;
  late File _accessFile;
  
  LogLevel _currentLevel = LogLevel.debug;
  bool _initialized = false;

  Future<void> initialize({LogLevel level = LogLevel.debug}) async {
    if (_initialized) return;
    
    _currentLevel = level;
    
    // Criar diretório de logs se não existir
    final logDirectory = Directory(_logDir);
    if (!await logDirectory.exists()) {
      await logDirectory.create(recursive: true);
    }

    // Configurar arquivos de log
    final timestamp = DateTime.now().toIso8601String().split('T')[0];
    _logFile = File('$_logDir/app_$timestamp.log');
    _errorFile = File('$_logDir/error_$timestamp.log');
    _accessFile = File('$_logDir/access_$timestamp.log');

    // Criar arquivos se não existirem
    if (!await _logFile.exists()) await _logFile.create();
    if (!await _errorFile.exists()) await _errorFile.create();
    if (!await _accessFile.exists()) await _accessFile.create();

    _initialized = true;
    info('Logger inicializado', {'logLevel': _currentLevel.name, 'logDir': _logDir});
  }

  void _writeLog(LogLevel level, String message, [Map<String, dynamic>? context, StackTrace? stackTrace]) {
    if (!_initialized || level.level < _currentLevel.level) return;

    final timestamp = DateTime.now().toIso8601String();
    final logEntry = {
      'timestamp': timestamp,
      'level': level.name,
      'message': message,
      'pid': pid,
      if (context != null) 'context': context,
      if (stackTrace != null) 'stackTrace': stackTrace.toString(),
    };

    final logLine = '${jsonEncode(logEntry)}\n';

    // Escrever no console com cores
    _printColoredLog(level, timestamp, message, context);

    // Escrever no arquivo principal
    _logFile.writeAsStringSync(logLine, mode: FileMode.append);

    // Escrever erros em arquivo separado
    if (level.level >= LogLevel.error.level) {
      _errorFile.writeAsStringSync(logLine, mode: FileMode.append);
    }
  }

  void _printColoredLog(LogLevel level, String timestamp, String message, Map<String, dynamic>? context) {
    String color;
    switch (level) {
      case LogLevel.debug:
        color = '\x1B[36m'; // Cyan
        break;
      case LogLevel.info:
        color = '\x1B[32m'; // Green
        break;
      case LogLevel.warning:
        color = '\x1B[33m'; // Yellow
        break;
      case LogLevel.error:
        color = '\x1B[31m'; // Red
        break;
      case LogLevel.critical:
        color = '\x1B[35m'; // Magenta
        break;
    }
    const reset = '\x1B[0m';

    final contextStr = context != null ? ' ${jsonEncode(context)}' : '';
    print('$color[$timestamp] [${level.name}] $message$contextStr$reset');
  }

  void debug(String message, [Map<String, dynamic>? context]) {
    _writeLog(LogLevel.debug, message, context);
  }

  void info(String message, [Map<String, dynamic>? context]) {
    _writeLog(LogLevel.info, message, context);
  }

  void warning(String message, [Map<String, dynamic>? context]) {
    _writeLog(LogLevel.warning, message, context);
  }

  void error(String message, [Map<String, dynamic>? context, StackTrace? stackTrace]) {
    _writeLog(LogLevel.error, message, context, stackTrace);
  }

  void critical(String message, [Map<String, dynamic>? context, StackTrace? stackTrace]) {
    _writeLog(LogLevel.critical, message, context, stackTrace);
  }

  void logRequest(String method, String path, int statusCode, int responseTime, [Map<String, dynamic>? context]) {
    final logEntry = {
      'timestamp': DateTime.now().toIso8601String(),
      'type': 'ACCESS',
      'method': method,
      'path': path,
      'statusCode': statusCode,
      'responseTime': '${responseTime}ms',
      'pid': pid,
      if (context != null) ...context,
    };

    final logLine = '${jsonEncode(logEntry)}\n';
    _accessFile.writeAsStringSync(logLine, mode: FileMode.append);

    // Log colorido no console
    String statusColor;
    if (statusCode >= 200 && statusCode < 300) {
      statusColor = '\x1B[32m'; // Green
    } else if (statusCode >= 300 && statusCode < 400) {
      statusColor = '\x1B[33m'; // Yellow
    } else {
      statusColor = '\x1B[31m'; // Red
    }
    const reset = '\x1B[0m';

    print('$statusColor$method $path - $statusCode (${responseTime}ms)$reset');
  }

  Future<String> getDumpInfo() async {
    final info = {
      'timestamp': DateTime.now().toIso8601String(),
      'pid': pid,
      'logLevel': _currentLevel.name,
      'logDirectory': _logDir,
      'files': {
        'mainLog': _logFile.path,
        'errorLog': _errorFile.path,
        'accessLog': _accessFile.path,
      },
      'systemInfo': {
        'platform': Platform.operatingSystem,
        'version': Platform.operatingSystemVersion,
        'dart': Platform.version,
      }
    };

    return jsonEncode(info);
  }

  Future<List<String>> getRecentLogs({int lines = 50}) async {
    if (!await _logFile.exists()) return [];
    
    final content = await _logFile.readAsString();
    final logLines = content.split('\n').where((line) => line.isNotEmpty).toList();
    
    return logLines.length > lines 
        ? logLines.sublist(logLines.length - lines)
        : logLines;
  }

  Future<List<String>> getRecentErrors({int lines = 20}) async {
    if (!await _errorFile.exists()) return [];
    
    final content = await _errorFile.readAsString();
    final errorLines = content.split('\n').where((line) => line.isNotEmpty).toList();
    
    return errorLines.length > lines 
        ? errorLines.sublist(errorLines.length - lines)
        : errorLines;
  }

  Future<void> rotateLogs() async {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    
    if (await _logFile.exists()) {
      await _logFile.rename('${_logFile.path}.$timestamp');
    }
    if (await _errorFile.exists()) {
      await _errorFile.rename('${_errorFile.path}.$timestamp');
    }
    if (await _accessFile.exists()) {
      await _accessFile.rename('${_accessFile.path}.$timestamp');
    }

    // Recriar arquivos
    await initialize(level: _currentLevel);
  }
}
