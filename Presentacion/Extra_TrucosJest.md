---

## Trucos en Jest para Desarrolladores Pro

---

### Enfocando Tests Específicos: `it.only()` y `fit()`

A veces, mientras desarrollas o depuras, quieres ejecutar solo una prueba o un pequeño conjunto de pruebas. Jest te ofrece `it.only()` (o su alias `fit()`) para lograr esto. Al usarlo en un bloque `it`, solo esa prueba se ejecutará.

**¿Por qué usarlo?**

* **Depuración rápida:** Aísla la prueba que está fallando para concentrarte en la solución.
* **Desarrollo iterativo:** Prueba un caso específico mientras construyes una nueva funcionalidad.

**Ejemplo:**

```typescript
describe('MiComponente', () => {
  it('debería renderizar correctamente', () => {
    // ... aserciones ...
  });

  it.only('debería manejar el evento de clic', () => {
    // ... aserciones específicas para el clic ...
  });

  it('otro test que no quiero ejecutar ahora', () => {
    // ... aserciones ...
  });
});
```


Importante: ¡No olvides eliminar o comentar los it.only() antes de hacer commit de tu código! De lo contrario, solo esas pruebas específicas se ejecutarán en tu pipeline de CI/CD.

Omitiendo Tests Temporalmente: it.skip() y xit()
Si tienes pruebas que están fallando o aún no están implementadas, puedes omitirlas temporalmente usando it.skip() (o su alias xit()). Estas pruebas se marcarán como omitidas en los resultados de Jest.

¿Por qué usarlo?

Evitar fallos en la suite de pruebas: Omitir pruebas que sabes que están rotas para que el resto de las pruebas pasen.
Planificación de trabajo: Marcar pruebas para funcionalidades futuras como omitidas hasta que se implementen.
Ejemplo:

```typescript
    describe('MiAPI', () => {
        it('debería obtener datos del servidor', async () => {
            // ... aserciones ...
        });

        it.skip('debería manejar errores de red', async () => {
            // ... aserciones para el manejo de errores ...
        });

        it('otro test funcionando', async () => {
            // ... aserciones ...
        });
    });
```

Enfocando Grupos de Pruebas: describe.only() y fdescribe()
Similar a it.only(), puedes enfocar la ejecución de todas las pruebas dentro de un bloque describe específico utilizando describe.only() (o su alias fdescribe()).

¿Por qué usarlo?

Concentrarse en un módulo: Cuando trabajas en una parte específica de tu aplicación, puedes ejecutar solo las pruebas relacionadas con ese módulo.
Ejemplo:

```typescript
   describe.only('Funcionalidad de Autenticación', () => {
        it('debería permitir el inicio de sesión con credenciales válidas', () => {
            // ... aserciones ...
        });

        it('debería rechazar el inicio de sesión con credenciales inválidas', () => {
            // ... aserciones ...
        });

        describe('Restablecimiento de Contraseña', () => {
            it('debería enviar un correo electrónico de restablecimiento', () => {
            // ... aserciones ...
            });
        });
    });

    describe('Otra Funcionalidad', () => {
        it('este test no se ejecutará ahora', () => {
            // ... aserciones ...
        });
    });
```


Importante: Al igual que con it.only(), recuerda eliminar o comentar los describe.only() antes de hacer commit.

Omitiendo Grupos de Pruebas: describe.skip() y xdescribe()
De manera similar a it.skip(), puedes omitir la ejecución de todas las pruebas dentro de un bloque describe utilizando describe.skip() (o su alias xdescribe()).

¿Por qué usarlo?

Deshabilitar temporalmente un conjunto de pruebas: Útil cuando una funcionalidad completa está rota o en desarrollo.
Ejemplo:

```typescript
    describe('Funcionalidad de Facturación', () => {
        it('debería generar una factura', () => {
            // ... aserciones ...
        });
    });

    describe.skip('Antigua Funcionalidad (Temporalmente Deshabilitada)', () => {
        it('este test no se ejecutará', () => {
            // ... aserciones ...
        });
    });
```

Aprovechando beforeEach, afterEach, beforeAll, afterAll
Estos hooks te permiten ejecutar código antes o después de cada prueba (each) o antes o después de todas las pruebas en un bloque describe (all). Son esenciales para la configuración y limpieza de tus pruebas.

Ejemplo:

```typescript
    describe('UserController', () => {
        let user;

        beforeEach(() => {
            user = { id: 1, name: 'Test User' };
            // Configurar mocks o datos comunes aquí
        });

        afterEach(() => {
            // Limpiar cualquier recurso o estado después de cada prueba
        });

        it('should return the user', () => {
            expect(user.name).toBe('Test User');
        });

        it('should have an ID', () => {
            expect(user.id).toBe(1);
        });
    });
```

El Poder de los Mocks con jest.fn(), jest.mock(), jest.spyOn()
Jest proporciona herramientas poderosas para crear mocks y spies, lo que te permite aislar la unidad de código que estás probando y controlar sus dependencias.

jest.fn(): Crea una función mock.
jest.mock('module-name'): Reemplaza un módulo completo con un mock.
jest.spyOn(object, 'methodName'): Espía una función existente en un objeto y te permite rastrear sus llamadas.
Snapshot Testing para Componentes y Salidas
Los snapshot tests son una forma útil de verificar que la salida de tu componente o función no ha cambiado inesperadamente. Jest guarda una "foto" (snapshot) de la salida y la compara con futuras ejecuciones de la prueba.

Ejemplo (React):

```typescript
    it('should render correctly', () => {
        const { asFragment } = render(<MiComponente />);
        expect(asFragment()).toMatchSnapshot();
    });
```