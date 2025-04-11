---

## `jest.config.js`: Configurando Jest para tu Proyecto

El archivo `jest.config.js` (o `jest.config.ts` si estás usando TypeScript) es el corazón de la configuración de Jest para tu proyecto. Te permite personalizar el comportamiento de Jest, desde la forma en que encuentra y ejecuta las pruebas hasta la generación de informes de cobertura y la gestión de módulos.

---

### Estructura Básica del Archivo de Configuración

Un archivo `jest.config.js` típico exporta un objeto que contiene las opciones de configuración.

```typescript
/** @type {import('jest').Config} */
module.exports = {
  // Aquí van las opciones de configuración
};
```

Si estás usando TypeScript, puedes usar jest.config.ts:

```typescript
    import type { Config } from '@jest/types';

    const config: Config.InitialOptions = {
    // Aquí van las opciones de configuración
    };

    export default config;
```

Opciones de Configuración Comunes y Avanzadas
A continuación, se describen las variables de configuración más relevantes para un proyecto de TypeScript y Node.js:

1. roots: Array<string>
Define un array de directorios raíz que Jest debe escanear en busca de archivos de prueba.

Ejemplo:
```typescript
    roots: ['<rootDir>/src', '<rootDir>/tests'],
```

2. testMatch: Array<string>
Un array de patrones glob que Jest utiliza para identificar archivos de prueba.
Ejemplo:

```typescript
    testMatch: ['<rootDir>/tests/**/*.test.(ts|tsx|js|jsx)'],
```

3. testRegex: string | Array<string>
Una expresión regular o un array de expresiones regulares que Jest utiliza para identificar archivos de prueba.
Ejemplo:

```typescript
    testRegex: ['(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$'],
```

4. testPathIgnorePatterns: Array<string>
Un array de patrones glob o expresiones regulares para excluir directorios o archivos de la búsqueda de pruebas.
Ejemplo:

```typescript
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
```

5. moduleDirectories: Array<string>
Un array de directorios que Jest debe usar para buscar módulos (similar a NODE_PATH).
Ejemplo:

```typescript
    moduleDirectories: ['node_modules', '<rootDir>/src'],
```

6. moduleFileExtensions: Array<string>
Un array de extensiones de archivo que Jest debe considerar como módulos.
Ejemplo:

```typescript
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
```

7. moduleNameMapper: { [key: string]: string | Array<string> }
Un objeto que mapea nombres de módulos a rutas de archivo. Útil para resolver alias de importación o simular módulos.
Ejemplo:

```typescript
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
```

8. transform: { [key: string]: string }
Un objeto que mapea patrones de archivo a los módulos de transformación que se utilizarán para procesar esos archivos antes de la ejecución de las pruebas. Esencial para TypeScript, JSX, CSS, etc.
Ejemplo 

```typescript
    transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-stub',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/fileTransformer.js',
  },
```

9. transformIgnorePatterns: Array<string>
Un array de patrones para excluir archivos de la transformación. Útil para módulos grandes de node_modules que ya están transpilados.

Ejemplo:

```typescript
    transformIgnorePatterns: ['/node_modules/(?!lodash-es)/'],
```

10. collectCoverage: boolean
Indica si Jest debe recopilar información de cobertura de código durante la ejecución de las pruebas.
Ejemplo:

```typescript
    collectCoverage: true,
```

11. coverageDirectory: string
Especifica el directorio donde se deben escribir los informes de cobertura.
Ejemplo:

```typescript
    coverageDirectory: 'coverage',
```

12. coverageReporters: Array<string>
Un array de nombres de reporteros de cobertura que se deben utilizar.
Ejemplo:

```typescript
    coverageReporters: ['text', 'lcov', 'clover', 'json'],
```

13. collectCoverageFrom: Array<string>
Un array de patrones glob que indican qué archivos deben incluirse en los informes de cobertura.
Ejemplo:

```typescript
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts,tsx,js,jsx}',
        '!<rootDir>/src/**/*.d.ts',
        '!<rootDir>/src/**/index.ts',
    ],
```

14. coveragePathIgnorePatterns: Array<string>
Un array de patrones para excluir archivos de la recopilación de cobertura.
Ejemplo:

```typescript
    coveragePathIgnorePatterns: ['<rootDir>/src/types/', '<rootDir>/src/constants/'],

```


15. coverageThreshold: { [key: string]: number }
Un objeto que define los umbrales de cobertura mínimos que deben cumplirse. Si no se cumplen, Jest fallará la suite de pruebas.
Ejemplo:

```typescript
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
        '<rootDir>/src/components/': {
            lines: 90,
        },
    },
```

16. reporters: Array<moduleName | [moduleName, options]>
Un array de módulos de reporteros personalizados que se utilizarán para mostrar los resultados de las pruebas.
Ejemplo:

```typescript
    reporters: ['default', ['jest-junit', { outputDirectory: 'junit' }]],
```

17. verbose: boolean
Si se establece en true, Jest mostrará los resultados de cada prueba individualmente.
Ejemplo:
```typescript
    verbose:true
```

18. silent: boolean
Si se establece en true, Jest evitará toda la salida de la consola, excepto los errores.
Ejemplo:

```typescript
    silent: false
```

19. testEnvironment: string
Especifica el entorno de prueba que se utilizará para ejecutar las pruebas. Los valores comunes son 'node' para pruebas de Node.js y 'jsdom' para pruebas que simulan un entorno de navegador.
Ejemplo:
```typescript
    testEnvironment: 'node' o 'jsdom'
```

20. testEnvironmentOptions: object
Un objeto que contiene opciones para configurar el entorno de prueba especificado en testEnvironment.
Ejemplo 

```typescript
    testEnvironmentOptions: {
        url: 'http://localhost/',
    },
```

21. setupFiles: Array<string>
Un array de rutas a módulos que se ejecutarán una vez antes de que se ejecuten todas las pruebas en cada archivo de prueba. Útil para configuraciones globales.
Ejemplo:

```typescript
    setupFiles: ['<rootDir>/setupTests.js'],
```

22. setupFilesAfterEnv: Array<string>
Un array de rutas a módulos que se ejecutarán una vez después de que el entorno de prueba haya sido configurado para cada archivo de prueba. Útil para configurar adaptadores o extensiones de prueba.
Ejemplo:

```typescript
    setupFilesAfterEnv: ['<rootDir>/src/setupTestsAfterEnv.ts'],
```

23. globalSetup: string
La ruta a un módulo que exporta una función async que se ejecutará una vez antes de que comiencen todas las suites de pruebas. Útil para configurar un entorno global como una base de datos de prueba.
Ejemplo:

```typescript
    globalTeardown: '<rootDir>/globalTeardown.js',
```

24. globalTeardown: string
La ruta a un módulo que exporta una función async que se ejecutará una vez después de que hayan finalizado todas las suites de pruebas. Útil para limpiar un entorno global como cerrar una conexión a la base de datos de prueba.
Ejemplo:

```typescript
    globalTeardown:'<rootDir>/globalTeardown.js'
```

25. globals: { [key: string]: any }
Un objeto que define variables globales que estarán disponibles en el entorno de prueba.
Ejemplo:

```typescript
    globals: {
        __DEV__: true,
    },    
```

26. watchPlugins: Array<string | [string, Record<string, unknown>]>
Un array de plugins personalizados para la interfaz de modo de observación de Jest (jest --watch).
Ejemplo:

```typescript
    watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
    ],
```

27. watchman: boolean
Indica si se debe utilizar Watchman para la detección rápida de cambios de archivos. Requiere que Watchman esté instalado.
Ejemplo:

```typescript
    watchman:true
```

28. cache: boolean
Indica si Jest debe usar una caché para acelerar las ejecuciones posteriores.
Ejemplo:

```typescript
    cache:true
```

29. cacheDirectory: string
Especifica el directorio donde Jest debe almacenar su caché.
Ejemplo:

```typescript
    cacheDirectory:'<rootDir>/.jest-cache'
```

30. clearMocks: boolean
Si se establece en true, Jest borrará automáticamente el estado de todos los mocks entre pruebas.
Ejemplo:

```typescript
    clearMocks:false
```

31. resetMocks: boolean
Si se establece en true, Jest restablecerá automáticamente el estado de todos los mocks entre pruebas.
Ejemplo:

```typescript
    resetMocks:false
```

32. restoreMocks: boolean
Si se establece en true, Jest restaurará automáticamente la implementación original de todos los mocks entre pruebas.
Ejemplo:

```typescript
    restoreMocks:false
```

33. maxWorkers: number | string
Especifica el número máximo de workers que Jest debe usar para ejecutar pruebas en paralelo. Puede ser un número o una cadena como '50%' para usar el 50% de las CPU.
Ejemplo:

```typescript
    maxWorkers: '50%',
```

34. rootDir: string
La raíz del proyecto de Jest. Por defecto, es el directorio que contiene el archivo de configuración.
Ejemplo:

```typescript
    rootDir: "yourDir"
    // Por defecto, es el directorio que contiene este archivo
```

35. runner: string
Especifica un runner de pruebas personalizado para usar en lugar del runner predeterminado de Jest.
Ejemplo:

```typescript
    runner: 'jest-runner',
```

36. snapshotSerializers: Array<string>
Un array de rutas a módulos de serializadores de snapshots personalizados. Útil para formatear snapshots de objetos complejos.
Ejemplo:

```typescript
    snapshotSerializers: ['jest-serializer-react'],
```

37. updateSnapshot: 'new' | 'none' | 'all'
Controla cómo se manejan los snapshots. 'all' actualiza todos los snapshots, 'new' crea nuevos snapshots y 'none' no actualiza ni crea snapshots.
Ejemplo:

```typescript
    updateSnapshot: 'all',
```

38. preset: string
Especifica una configuración predefinida para Jest. Por ejemplo, 'ts-jest' para proyectos de TypeScript o 'react-native'. Usar un preset a menudo configura automáticamente varias otras opciones.
Ejemplo:

```typescript
    preset: 'ts-jest'
```
Configuración Típica para un Proyecto TypeScript
Para un proyecto típico de TypeScript con Node.js, una configuración básica podría verse así:

JavaScript

```typescript
    /** @type {import('jest').Config} */
    module.exports = {
        preset: 'ts-jest',
        testEnvironment: 'node',
        roots: ['<rootDir>/src', '<rootDir>/tests'],
        testMatch: ['**/*.test.(ts|tsx)'],
        moduleDirectories: ['node_modules', '<rootDir>/src'],
        moduleNameMapper: {
            '^@/(.*)$': '<rootDir>/src/$1',
        },
        collectCoverageFrom: [
            '<rootDir>/src/**/*.{ts,tsx}',
            '!<rootDir>/src/**/*.d.ts',
            '!<rootDir>/src/**/index.ts', // O cualquier archivo de entrada principal
        ],
        coverageDirectory: 'coverage',
        coverageReporters: ['text', 'lcov'],
    };
```

