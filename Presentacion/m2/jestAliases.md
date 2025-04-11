---

## Test Properties y Aliases en Jest

Jest ofrece algunas propiedades y aliases que pueden hacer que tus definiciones de prueba sean más expresivas y concisas. Aunque Jest no tiene un sistema robusto para agregar propiedades arbitrarias a las pruebas de forma nativa, sí proporciona aliases útiles para las funciones de definición de pruebas y bloques.

---

### Aliases para `it`: `test`

La función `it` es la forma principal de definir casos de prueba individuales en Jest. Sin embargo, Jest también proporciona un alias directo para `it`: **`test`**.

**¿Por qué usar `test`?**

* **Simplemente una cuestión de preferencia:** Algunos desarrolladores encuentran que la palabra `test` es más intuitiva o se ajusta mejor a su estilo de codificación.
* **Legibilidad:** En ciertos contextos, `test` puede leerse más naturalmente dentro de un bloque `describe`.

**Ejemplos:**

```typescript
    describe('MiFunción', () => {
        it('debería hacer algo', () => {
            // ... aserciones ...
        });

        test('también debería hacer otra cosa', () => {
            // ... más aserciones ...
        });
    });
```

Como puedes ver, it y test son completamente intercambiables y hacen exactamente lo mismo. La elección entre ellos es puramente estilística.

**Aliases para Modificadores de Enfoque y Omisión**

Jest también proporciona aliases para los modificadores .only y .skip que se utilizan con it y describe:

**Aliases para .only**

- fit(...): Es un alias directo para it.only(...). Se utiliza para ejecutar solo esa prueba específica.
- fdescribe(...): Es un alias directo para describe.only(...). Se utiliza para ejecutar solo las pruebas dentro de ese bloque describe.

Ejemplos:


```typescript
    describe('Conjunto de Pruebas Importante', () => {
        fit('esta prueba es la única que se ejecutará', () => {
            // ... aserciones ...
        });

        it('esta prueba se omitirá', () => {
            // ...
        });
    });

    fdescribe('Otro Conjunto de Pruebas Enfocado', () => {
        it('todas las pruebas dentro de este bloque se ejecutarán', () => {
            // ...
        });

        it('otra prueba aquí', () => {
            // ...
        });
    });
```
**Aliases para .skip**

- xit(...): Es un alias directo para it.skip(...). Se utiliza para omitir esa prueba específica.
- xdescribe(...): Es un alias directo para describe.skip(...). Se utiliza para omitir todas las pruebas dentro de ese bloque describe.

Ejemplos:


```typescript
    describe('Conjunto de Pruebas con Pruebas Omitidas', () => {
        xit('esta prueba será omitida', () => {
            // ...
        });

        it('esta prueba se ejecutará', () => {
            // ...
        });
    });

    xdescribe('Conjunto de Pruebas Completo Omitido', () => {
        it('esta prueba no se ejecutará', () => {
            // ...
        });

        it('ni esta tampoco', () => {
            // ...
        });
    });
```


---

## Planificando Pruebas Futuras con `it.todo()`

A veces, durante la planificación o el desarrollo, sabes que necesitas escribir una prueba para una funcionalidad específica, pero aún no estás listo para implementarla. Jest te ofrece `it.todo()` para marcar estos casos de prueba pendientes.

**¿Qué es `it.todo()`?**

`it.todo()` te permite definir un nombre para una prueba que aún no tiene implementación. Jest reconocerá estas pruebas en tus resultados como "pendientes" o "to do", lo que te proporciona una visión clara de las pruebas que aún necesitas escribir.

**Sintaxis Básica:**

```typescript
it.todo('debería implementar la lógica para este caso');
```


Simplemente llamas a it.todo() con una cadena que describe la prueba que planeas escribir. No necesitas proporcionar una función de prueba.

Ejemplo:


```typescript
    describe('UserService', () => {
        it('debería retornar un usuario por su ID', () => {
            // ... implementación de la prueba ...
        });

        it.todo('debería crear un nuevo usuario');

        it('debería actualizar la información de un usuario existente', () => {
            // ... implementación de la prueba ...
        });

        it.todo('debería eliminar un usuario');
    });
```

**Cómo Aparece en los Resultados de Jest:**

Cuando ejecutas tus pruebas con Jest, las pruebas marcadas con it.todo() aparecerán en los resultados como pendientes. Esto te da una indicación clara de qué áreas de tu código aún no están completamente probadas.

**¿Por qué usar it.todo()?**

- Planificación de pruebas: Te permite esbozar la estructura de tus pruebas antes de escribir el código de prueba real.
- Documentación de requisitos de prueba: Actúa como una lista de tareas pendientes para las pruebas que necesitas implementar.
- Visión general del estado de las pruebas: Proporciona una visión rápida de qué funcionalidades tienen pruebas completas y cuáles aún necesitan ser probadas.
- Comunicación con el equipo: Ayuda a comunicar al equipo qué pruebas aún están pendientes de implementación.

**Diferencia entre it.todo() e it.skip():**

- it.todo(): Indica una prueba que aún no se ha implementado. Jest la reconoce como una prueba pendiente.
- it.skip(): Indica una prueba que se ha implementado pero se omite temporalmente de la ejecución. Jest la marca como omitida en los resultados.


---

## Ejecución Paralela de Pruebas con `.concurrent` en Jest

En suites de pruebas grandes, el tiempo de ejecución puede convertirse en un factor importante. Jest ofrece el modificador `.concurrent` para el bloque `describe` que permite que las pruebas dentro de ese bloque se ejecuten en paralelo, lo que potencialmente reduce el tiempo total de ejecución de las pruebas.

**¿Qué es `.concurrent`?**

El modificador `.concurrent` aplicado a un bloque `describe` le indica a Jest que intente ejecutar todas las pruebas (`it` o `test`) dentro de ese bloque simultáneamente, en lugar de secuencialmente.

**Cómo Utilizar `.concurrent`:**

Para habilitar la ejecución concurrente para un grupo de pruebas, simplemente añade `.concurrent` después de la llamada a `describe`:

```typescript
describe.concurrent('Mi Conjunto de Pruebas Concurrente', () => {
  it('prueba 1', async () => {
    // ... aserciones ...
  });

  it('prueba 2', async () => {
    // ... aserciones ...
  });

  it('prueba 3', async () => {
    // ... aserciones ...
  });
});
```

En este ejemplo, Jest intentará ejecutar prueba 1, prueba 2 y prueba 3 al mismo tiempo.

Beneficios de la Concurrencia:

- Reducción del tiempo de ejecución: Si tus pruebas son independientes y realizan operaciones que pueden ejecutarse en paralelo (por ejemplo, llamadas a diferentes APIs o cálculos independientes), la ejecución concurrente puede disminuir significativamente el tiempo total necesario para ejecutar la suite de pruebas.

**Cuándo Utilizar .concurrent:**

- Pruebas independientes: El uso de .concurrent es más efectivo cuando las pruebas dentro del bloque describe son independientes entre sí y no comparten estado mutable ni recursos.

- Operaciones asíncronas: Las pruebas que realizan operaciones asíncronas (como llamadas de red o operaciones de archivos) son buenos candidatos para la ejecución concurrente, ya que Jest puede ejecutar otras pruebas mientras espera la finalización de una operación asíncrona.

**Consideraciones y Posibles Inconvenientes:**

- Compartir estado: Si tus pruebas dentro de un bloque .concurrent comparten estado mutable o recursos (por ejemplo, modificar una variable global o interactuar con la misma base de datos sin aislamiento), la ejecución concurrente puede llevar a resultados inesperados, fallos intermitentes y condiciones de carrera difíciles de depurar.
- Orden de ejecución: Aunque generalmente no se recomienda depender del orden de ejecución de las pruebas, la ejecución concurrente implica que no hay garantía de en qué orden se completarán las pruebas.
- Sobrecarga: Para suites de pruebas muy pequeñas o pruebas que son extremadamente rápidas, la sobrecarga de la gestión de la concurrencia podría incluso hacer que la ejecución sea ligeramente más lenta.

Ejemplo (TypeScript):

```typescript
describe.concurrent('Simulando Llamadas a API Concurrentes', () => {
  const fetchData = async (id: number) => {
    // Simula una llamada a una API con un pequeño retraso
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    return { id, data: `Data for ID ${id}` };
  };

  it('should fetch data for ID 1', async () => {
    const result = await fetchData(1);
    expect(result).toEqual({ id: 1, data: 'Data for ID 1' });
  });

  it('should fetch data for ID 2', async () => {
    const result = await fetchData(2);
    expect(result).toEqual({ id: 2, data: 'Data for ID 2' });
  });

  it('should fetch data for ID 3', async () => {
    const result = await fetchData(3);
    expect(result).toEqual({ id: 3, data: 'Data for ID 3' });
  });
});
```

En este ejemplo, cada prueba simula una llamada a una API independiente, por lo que pueden ejecutarse de forma segura en paralelo.

**¿Cuándo usar .concurrent en it?**

- Control granular: Te da un control más preciso sobre qué pruebas se benefician de la ejecución paralela. Puedes tener un bloque describe donde la mayoría de las pruebas necesitan ejecutarse secuencialmente debido a dependencias o configuración compartida, pero algunas pruebas individuales son independientes y pueden ejecutarse en paralelo para ahorrar tiempo.
- Aislamiento de pruebas concurrentes: Si tienes algunas pruebas que sabes que son seguras para ejecutarse en paralelo (por ejemplo, no comparten estado mutable) pero otras en el mismo bloque no lo son, puedes marcar solo las seguras con .concurrent.
Ejemplo (TypeScript):

```typescript
describe('Operaciones con Usuarios', () => {
  let sharedResource: any;

  beforeEach(() => {
    // Configuración que debe ser secuencial
    sharedResource = { value: 0 };
  });

  it('debería incrementar el valor secuencialmente', async () => {
    sharedResource.value++;
    expect(sharedResource.value).toBe(1);
  });

  it.concurrent('debería leer un usuario de forma concurrente', async () => {
    // Esta prueba probablemente no modifica el estado compartido
    const user = await fetchUser(1);
    expect(user).toBeDefined();
  });

  it.concurrent('debería leer otro usuario de forma concurrente', async () => {
    // Esta prueba también es independiente
    const user = await fetchUser(2);
    expect(user).toBeDefined();
  });

  it('debería decrementar el valor secuencialmente', async () => {
    sharedResource.value--;
    expect(sharedResource.value).toBe(0);
  });
});

async function fetchUser(id: number) {
  // Simulación de una llamada a una API
  await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
  return { id, name: `User ${id}` };
}
```

En este ejemplo, las pruebas que modifican sharedResource se ejecutan secuencialmente para evitar condiciones de carrera, mientras que las pruebas que solo leen datos de forma asíncrona se ejecutan en paralelo para mejorar el rendimiento.

**Precauciones:**

Al igual que con describe.concurrent, asegúrate de que las pruebas marcadas con it.concurrent sean realmente seguras para ejecutarse en paralelo y no dependan de un orden de ejecución específico o compartan estado mutable de manera insegura.

**Combinando Pruebas Concurrentes y No Concurrentes:**

Puedes tener múltiples bloques describe en tu archivo de pruebas, algunos con .concurrent y otros sin él. Jest ejecutará los bloques no concurrentes secuencialmente y las pruebas dentro de los bloques concurrentes en paralelo.