---

## Testing para Errores en Jest

Es crucial probar que tu código maneja los errores de manera correcta y esperada. Jest proporciona varias formas de verificar que las funciones lancen excepciones (errores síncronos) o rechacen promesas (errores asíncronos) cuando las condiciones lo requieren.

---

### Probando Errores Síncronos con `toThrow()`

El matcher `toThrow()` se utiliza para verificar si una función lanza una excepción cuando se ejecuta.

**Sintaxis Básica:**

```typescript

    expect(() => myFunctionThatMightThrow()).toThrow();

```

Ejemplo Básico:

```typescript
    const divide = (a: number, b: number) => {
        if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        return a / b;
    };

    describe('divide', () => {
        it('should throw an error when dividing by zero', () => {
            expect(() => divide(10, 0)).toThrow();
        });
    });

```

Verificando un Mensaje de Error Específico:

Puedes especificar el mensaje de error que esperas que se lance.

```typescript
    describe('divide', () => {
        it('should throw an error with the correct message', () => {
            expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
        });
    });
```

Verificando un Tipo de Error Específico:

También puedes verificar si se lanza un error de un tipo específico (por ejemplo, una instancia de la clase TypeError).


```typescript
    const processString = (str: string) => {
    if (typeof str !== 'string') {
        throw new TypeError('Input must be a string');
    }
    // ... procesamiento de la cadena ...
    };
```

```typescript
    describe('processString', () => {
        it('should throw a TypeError if the input is not a string', () => {
            expect(() => processString(123 as any)).toThrow(TypeError);
        });

        it('should throw a TypeError with the correct message', () => {
            expect(() => processString(123 as any)).toThrow('Input must be a string'); // También funciona para el mensaje
        });
    });

```

Combinando Verificaciones de Mensaje y Tipo:

Puedes combinar la verificación del tipo de error y el mensaje.



```typescript
    describe('processString', () => {
        it('should throw a TypeError with the specific message', () => {
            expect(() => processString(123 as any)).toThrow(new TypeError('Input must be a string'));
        });
    });
```

Probando Errores Asíncronos (Promesas) con rejects
Cuando trabajas con código asíncrono que utiliza Promesas, el matcher toThrow() no funcionará directamente. En su lugar, debes usar el matcher rejects.

Sintaxis Básica:


```typescript
    await expect(asyncFunctionThatReturnsAPromise()).rejects.toThrow();

    const fetchData = async (id: number) => {
        if (id <= 0) {
            return Promise.reject(new Error('Invalid ID'));
        }
        return Promise.resolve({ id, data: 'some data' });
    };

    describe('fetchData', () => {
        it('should reject with an error for an invalid ID', async () => {
            await expect(fetchData(0)).rejects.toThrow();
        });
    });

```

Verificando un Mensaje de Error Específico en Promesas:

```typescript

    describe('fetchData', () => {
        it('should reject with the correct error message', async () => {
            await expect(fetchData(-5)).rejects.toThrow('Invalid ID');
        });
    });
```

Verificando un Tipo de Error Específico en Promesas:

Si tu promesa rechaza con una instancia de un tipo de error específico, puedes verificarlo.


```typescript
    class ApiError extends Error {}

    const callApi = async (endpoint: string) => {
        if (!endpoint.startsWith('/api')) {
            return Promise.reject(new ApiError('Invalid endpoint'));
        }
        return Promise.resolve({ data: 'api response' });
    };

    describe('callApi', () => {
        it('should reject with an ApiError for an invalid endpoint', async () => {
            await expect(callApi('bad-endpoint')).rejects.toThrow(ApiError);
        });

        it('should reject with an ApiError and the correct message', async () => {
            await expect(callApi('wrong-endpoint')).rejects.toThrow('Invalid endpoint'); // También funciona
            await expect(callApi('wrong-endpoint')).rejects.toThrow(new ApiError('Invalid endpoint'));
        });
    });
```

---
Consideraciones para Errores en Callbacks
Para funciones asíncronas basadas en callbacks, la forma de probar errores puede variar. A menudo implica verificar si el callback de error se llama con el error esperado. Esto puede requerir el uso de mocks de Jest para espiar o simular el callback.

---

Evitando try...catch en Pruebas Unitarias de Errores
Si bien puedes usar bloques try...catch dentro de tus pruebas para capturar errores, generalmente se recomienda usar los matchers toThrow() y rejects() de Jest. Estos matchers están diseñados específicamente para probar condiciones de error y hacen que tus pruebas sean más declarativas y fáciles de leer.

---

Mejores Prácticas para Probar Errores
- Sé específico: Intenta ser lo más específico posible sobre el error que esperas (mensaje, tipo, etc.).
- Prueba el camino feliz y los caminos de error: Asegúrate de tener pruebas tanto para el comportamiento esperado (sin errores) como para los escenarios de error.
- Asegúrate de que el error se lanza/rechaza en las condiciones correctas: Verifica que la lógica que debería causar el error se active correctamente en tu prueba.
- Considera probar la ausencia de errores: En algunos casos, puede ser útil verificar que una función no lanza un error en ciertas condiciones.
