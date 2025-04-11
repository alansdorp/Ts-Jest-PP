---

## Hooks en Jest: Preparación y Limpieza en tus Pruebas

Los **hooks** en Jest son funciones que te permiten ejecutar código en diferentes momentos del ciclo de vida de tus pruebas. Son fundamentales para preparar el entorno antes de que se ejecuten las pruebas y para limpiar cualquier recurso utilizado después de que finalicen. Esto ayuda a mantener tus pruebas independientes, repetibles y fáciles de entender.

---

### Tipos de Hooks en Jest

Jest proporciona cuatro tipos principales de hooks:

* **`beforeAll(fn, timeout?)`**: Se ejecuta **una vez antes** de que comiencen todas las pruebas dentro de un bloque `describe`. Es útil para configuraciones pesadas o que solo necesitan realizarse una vez para todo el grupo de pruebas.
* **`beforeEach(fn, timeout?)`**: Se ejecuta **antes de cada** prueba individual (`it`) dentro de un bloque `describe`. Es ideal para preparar el estado necesario para cada prueba específica.
* **`afterEach(fn, timeout?)`**: Se ejecuta **después de cada** prueba individual (`it`) dentro de un bloque `describe`. Se utiliza para limpiar cualquier recurso o estado que haya sido modificado por la prueba.
* **`afterAll(fn, timeout?)`**: Se ejecuta **una vez después** de que hayan finalizado todas las pruebas dentro de un bloque `describe`. Es útil para realizar limpiezas finales o liberar recursos que se configuraron en `beforeAll`.

El argumento `fn` es la función que contiene el código del hook, y `timeout` es un tiempo de espera opcional en milisegundos.

---

### Orden de Ejecución de los Hooks

Los hooks se ejecutan en un orden específico:

1.  **`beforeAll`** (se ejecuta una vez al inicio del bloque `describe`).
2.  **`beforeEach`** (se ejecuta antes de cada prueba `it`).
3.  La prueba individual (`it`) se ejecuta.
4.  **`afterEach`** (se ejecuta después de cada prueba `it`).
5.  Los pasos 2-4 se repiten para cada prueba `it` en el bloque `describe`.
6.  **`afterAll`** (se ejecuta una vez al final del bloque `describe`).

---

### Ámbito de los Hooks en Bloques `describe` Anidados

Los hooks también pueden definirse dentro de bloques `describe` anidados. En este caso, se ejecutan en el siguiente orden:

1.  `beforeAll` del bloque `describe` externo.
2.  `beforeEach` del bloque `describe` externo.
3.  `beforeAll` del bloque `describe` interno.
4.  `beforeEach` del bloque `describe` interno.
5.  La prueba individual (`it`) dentro del bloque `describe` interno se ejecuta.
6.  `afterEach` del bloque `describe` interno.
7.  `afterAll` del bloque `describe` interno.
8.  `afterEach` del bloque `describe` externo.
9.  `afterAll` del bloque `describe` externo.

En resumen, los hooks del bloque `describe` más externo se ejecutan antes y después de los hooks del bloque `describe` más interno.

---

### Ejemplo de Código (TypeScript)

```typescript
describe('MiComponente', () => {
  let componentInstance: any;
  let mockDependency: any;

  beforeAll(() => {
    console.log('beforeAll del bloque MiComponente');
    // Configuración que solo se necesita una vez para todas las pruebas
    mockDependency = {
      getValue: jest.fn().mockReturnValue('initial value'),
    };
  });

  beforeEach(() => {
    console.log('beforeEach del bloque MiComponente');
    // Configuración que se necesita antes de cada prueba
    componentInstance = {
      dependency: mockDependency,
      data: [],
      loadData: jest.fn(),
    };
    componentInstance.loadData();
  });

  afterEach(() => {
    console.log('afterEach del bloque MiComponente');
    // Limpieza después de cada prueba
    componentInstance.data = [];
    mockDependency.getValue.mockClear();
    componentInstance.loadData.mockClear();
  });

  afterAll(() => {
    console.log('afterAll del bloque MiComponente');
    // Limpieza final después de todas las pruebas
    mockDependency = null;
  });

  it('debería cargar los datos correctamente', () => {
    console.log('Test: debería cargar los datos correctamente');
    expect(componentInstance.loadData).toHaveBeenCalledTimes(1);
  });

  it('debería tener una dependencia con el valor inicial', () => {
    console.log('Test: debería tener una dependencia con el valor inicial');
    expect(componentInstance.dependency.getValue()).toBe('initial value');
  });

  describe('cuando los datos se cargan exitosamente', () => {
    beforeAll(() => {
      console.log('beforeAll del bloque anidado');
      componentInstance.data = ['item1', 'item2'];
    });

    beforeEach(() => {
      console.log('beforeEach del bloque anidado');
    });

    afterEach(() => {
      console.log('afterEach del bloque anidado');
    });

    afterAll(() => {
      console.log('afterAll del bloque anidado');
      componentInstance.data = [];
    });

    it('debería tener dos elementos en los datos', () => {
      console.log('Test: debería tener dos elementos en los datos');
      expect(componentInstance.data).toHaveLength(2);
    });
  });
});

```

Salida en la consola (aproximada):

```cmd
    beforeAll del bloque MiComponente
    beforeEach del bloque MiComponente
    Test: debería cargar los datos correctamente
    afterEach del bloque MiComponente
    beforeEach del bloque MiComponente
    Test: debería tener una dependencia con el valor inicial
    afterEach del bloque MiComponente
    beforeAll del bloque anidado
    beforeEach del bloque MiComponente
    beforeEach del bloque anidado
    Test: debería tener dos elementos en los datos
    afterEach del bloque anidado
    afterEach del bloque MiComponente
    afterAll del bloque anidado
    afterAll del bloque MiComponente
```