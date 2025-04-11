---

## Los Principios F.I.R.S.T. para Buenas Pruebas Unitarias

Los principios F.I.R.S.T. son un conjunto de directrices que te ayudan a escribir pruebas unitarias efectivas, robustas y fáciles de mantener. Cada letra del acrónimo representa una característica importante de una buena prueba.

---

### F - Fast (Rápidas)

* **Significado:** Las pruebas unitarias deben ejecutarse rápidamente.
* **Por qué es importante:** Si las pruebas son lentas, los desarrolladores serán menos propensos a ejecutarlas con frecuencia. Esto puede llevar a que los errores se detecten más tarde en el ciclo de desarrollo, lo que resulta en correcciones más costosas y demoras.
* **En la práctica:** Mantén tus pruebas enfocadas en unidades pequeñas de código. Evita las interacciones con bases de datos reales, sistemas de archivos o servicios externos en las pruebas unitarias. Utiliza mocks y stubs para simular estas dependencias.

**Ejemplo**
Esta prueba es rápida porque no interactúa con una base de datos real. En su lugar, se utiliza un mock (jest.fn()) para simular el comportamiento del UserRepository, lo que permite que la prueba se ejecute en milisegundos.

```typescript
// userService.ts
import { UserRepository } from './userRepository';

interface User {
  id: number;
  name: string;
}

class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}

// userRepository.ts (Interfaz)
export interface UserRepository {
  findById(id: number): Promise<User | null>;
}

// userService.test.ts
import { UserService } from './userService';
import { UserRepository } from './userRepository';

describe('UserService', () => {
  it('should quickly return a user when found', async () => {
    // Arrange
    const mockUserRepository: UserRepository = {
      findById: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
    };
    const userService = new UserService(mockUserRepository);
    const userId = 1;

    // Act
    const user = await userService.getUserById(userId);

    // Assert
    expect(user).toEqual({ id: 1, name: 'John Doe' });
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });
});
```
---

### I - Independent (Independientes)

* **Significado:** Cada prueba unitaria debe ser independiente de las demás. El resultado de una prueba no debe afectar el resultado de otra.
* **Por qué es importante:** La independencia asegura que los fallos en las pruebas sean fáciles de diagnosticar. Si una prueba falla, sabrás que el problema está específicamente en el código que esa prueba está verificando. Las dependencias entre pruebas pueden llevar a fallos en cascada y dificultar la identificación de la causa raíz.
* **En la práctica:** Asegúrate de que cada prueba configure su propio estado necesario y realice su propia limpieza después de la ejecución. Evita compartir estado mutable entre pruebas.

**Ejemplo**

Cada prueba en este ejemplo tiene su propia configuración (beforeEach). Se crea una nueva instancia del mock mockUserRepository y del UserService para cada prueba. Esto asegura que el estado de una prueba no afecte a las demás.

```typescript

describe('UserService', () => {
  let mockUserRepository: UserRepository;
  let userService: UserService;

  beforeEach(() => {
    // Cada prueba tiene su propia instancia del mock y del servicio
    mockUserRepository = {
      findById: jest.fn(),
    };
    userService = new UserService(mockUserRepository);
  });

  it('should return a user object with the correct ID', async () => {
    // Arrange
    const mockUser = { id: 1, name: 'John Doe' };
    (mockUserRepository.findById as jest.Mock).mockResolvedValue(mockUser);
    const userId = 1;

    // Act
    const user = await userService.getUserById(userId);

    // Assert
    expect(user?.id).toBe(1);
  });

  it('should return a user object with the correct name', async () => {
    // Arrange
    const mockUser = { id: 1, name: 'Jane Doe' };
    (mockUserRepository.findById as jest.Mock).mockResolvedValue(mockUser);
    const userId = 1;

    // Act
    const user = await userService.getUserById(userId);

    // Assert
    expect(user?.name).toBe('Jane Doe');
  });
});
```

---

### R - Repeatable (Repetibles)

* **Significado:** Una prueba unitaria debe producir el mismo resultado cada vez que se ejecuta, en cualquier entorno.
* **Por qué es importante:** La repetibilidad es crucial para la confianza en tus pruebas. Si una prueba pasa a veces y falla otras sin que haya cambios en el código, es difícil confiar en sus resultados.
* **En la práctica:** Elimina cualquier factor externo que pueda influir en el resultado de la prueba. Esto incluye dependencias de la hora actual, datos aleatorios o configuraciones específicas del entorno. Utiliza datos de prueba consistentes y mocks para controlar las dependencias.

**Ejemplo**

Esta prueba siempre producirá el mismo resultado porque depende de un mock controlado. Independientemente de cuántas veces se ejecute la prueba o en qué entorno, el mock mockUserRepository siempre devolverá el mismo objeto para el ID especificado.

```typescript
describe('UserService', () => {
  it('should always return the same user for a given ID when mocked', async () => {
    // Arrange
    const mockUserRepository: UserRepository = {
      findById: jest.fn().mockResolvedValue({ id: 2, name: 'Peter Pan' }),
    };
    const userService = new UserService(mockUserRepository);
    const userId = 2;

    // Act
    const user1 = await userService.getUserById(userId);
    const user2 = await userService.getUserById(userId);

    // Assert
    expect(user1).toEqual({ id: 2, name: 'Peter Pan' });
    expect(user2).toEqual({ id: 2, name: 'Peter Pan' });
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(2);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });
});
```
---

### S - Self-Validating (Autovalidables)

* **Significado:** Una prueba unitaria debe ser capaz de determinar por sí misma si pasó o falló, sin necesidad de intervención humana.
* **Por qué es importante:** La autovalidación permite la automatización de las pruebas. Los resultados deben ser claros (pasó/falló) para que las herramientas de integración continua y los desarrolladores puedan entender el estado del código rápidamente.
* **En la práctica:** Utiliza aserciones claras (`expect` en Jest) para verificar que el comportamiento del código coincide con las expectativas. El resultado de la prueba debe basarse únicamente en estas aserciones.

**Ejemplo**

Cada prueba incluye aserciones (expect(...)) que definen claramente el resultado esperado. Si las aserciones se cumplen, la prueba pasa; de lo contrario, falla. No se requiere intervención humana para determinar el resultado de la prueba.

```typescript

describe('UserService', () => {
  it('should return null if the user is not found', async () => {
    // Arrange
    const mockUserRepository: UserRepository = {
      findById: jest.fn().mockResolvedValue(null),
    };
    const userService = new UserService(mockUserRepository);
    const userId = 99;

    // Act
    const user = await userService.getUserById(userId);

    // Assert
    expect(user).toBeNull(); // La prueba se valida a sí misma con esta aserción
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('should call the repository with the correct ID', async () => {
    // Arrange
    const mockUserRepository: UserRepository = {
      findById: jest.fn().mockResolvedValue({ id: 3, name: 'Wendy Darling' }),
    };
    const userService = new UserService(mockUserRepository);
    const userId = 3;

    // Act
    await userService.getUserById(userId);

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId); // La prueba se valida a sí misma con esta aserción
  });
});
```
---

### T - Timely (Oportunas)

* **Significado:** Las pruebas unitarias deben escribirse en el momento oportuno, idealmente justo antes o al mismo tiempo que se escribe el código que están probando.
* **Por qué es importante:** Escribir pruebas de forma oportuna ayuda a guiar el diseño del código, asegurando que sea más fácil de probar. También ayuda a detectar errores temprano en el ciclo de desarrollo, cuando son más fáciles y baratos de corregir. Esto está estrechamente relacionado con el desarrollo guiado por pruebas (TDD).
* **En la práctica:** Adopta una mentalidad de "primero la prueba". Considera cómo vas a probar tu código antes de escribir la implementación.

**Ejemplo**

El principio de "Timely" no se demuestra directamente con un fragmento de código de prueba ya escrito. Se refiere a la práctica de escribir las pruebas de manera oportuna, preferiblemente antes de escribir la implementación del código. El ejemplo proporcionado muestra cómo se escribiría una prueba para una función (createUser) que aún no se ha implementado, ilustrando el concepto de desarrollo guiado por pruebas (TDD).

```typescript
// Este principio se refiere al momento en que se escriben las pruebas.
// Idealmente, las pruebas unitarias se escriben justo antes o al mismo tiempo
// que se escribe el código que están probando (TDD - Test-Driven Development).

// Ejemplo:
// 1. Escribir una prueba para `UserService.createUser`.
// 2. Ejecutar la prueba (debería fallar porque la función no existe).
// 3. Escribir la implementación de `UserService.createUser`.
// 4. Ejecutar la prueba (debería pasar).
// 5. Refactorizar el código si es necesario.

// Ejemplo de una prueba que se escribiría ANTES de la implementación:
describe('UserService', () => {
  it('should call the repository to create a new user', async () => {
    // Arrange
    const mockUserRepository: UserRepository = {
      findById: jest.fn(),
      create: jest.fn().mockResolvedValue({ id: 4, name: 'Captain Hook' }), // Suponiendo que UserRepository tiene un método create
    };
    const userService = new UserService(mockUserRepository);
    const newUser = { name: 'Captain Hook' };

    // Act
    await userService.createUser(newUser); // Suponiendo que UserService tiene un método createUser

    // Assert
    expect(mockUserRepository.create).toHaveBeenCalledWith(newUser);
  });
});
```
---
