---

## Test Doubles en Jest: Aislamiento Efectivo en tus Pruebas

En las pruebas unitarias, el objetivo es aislar la unidad de código que estamos probando (la **SUT**, o System Under Test) de sus dependencias. Los **Test Doubles** son objetos o funciones que reemplazan a las dependencias reales de la SUT, permitiéndonos controlar su comportamiento y verificar las interacciones entre la SUT y sus colaboradores.

Jest proporciona excelentes herramientas para crear y utilizar diferentes tipos de Test Doubles.

---

### ¿Qué son los Test Doubles?

Los Test Doubles son análogos de producción de las dependencias de una unidad de código. Los usamos en las pruebas para:

* **Aislamiento:** Asegurar que la prueba se centre únicamente en el comportamiento de la SUT, sin verse afectada por el comportamiento de sus dependencias.

* **Control:** Permitirnos simular diferentes escenarios y condiciones que podrían ser difíciles de reproducir con las dependencias reales (por ejemplo, errores de red, respuestas lentas, estados específicos).

* **Velocidad:** Las dependencias reales (como bases de datos o servicios externos) pueden ser lentas. Los Test Doubles son generalmente más rápidos y hacen que las pruebas se ejecuten más rápido.

---

### Tipos de Test Doubles (con Ejemplos en Jest)

Martin Fowler identificó varios tipos de Test Doubles. Veamos cómo se implementan comúnmente en Jest:

**1.Dummies**

* **¿Qué es?** Un Dummy es un objeto que se pasa como argumento pero que nunca se utiliza realmente.
* Los Dummies son objetos que se pasan como argumentos pero que nunca se utilizan realmente. Su único propósito es satisfacer la lista de parámetros de una función o constructor.
* **Propósito:** Objetos que se pasan como argumentos pero que en realidad no se utilizan. Solo están ahí para cumplir con la lista de parámetros.
* **Analogía:** Un atrezzo en una obra de teatro que está ahí para verse pero no tiene ninguna función real en la trama.
* **Ejemplo:** Pasar un objeto logger vacío a una función que podría registrar algo pero no lo hace en ese escenario específico de la prueba.


* **Ejemplo en Jest:** Un simple objeto literal o un valor `null` o `undefined`.

```typescript
interface Logger {
  log(message: string): void;
}

class UserService {
  constructor(private logger: Logger) {}

  createUser(username: string) {
    this.logger.log(`Creating user: ${username}`);
    // ... lógica para crear el usuario ...
    return { id: 1, username };
  }
}

describe('UserService', () => {
  it('should create a user and log the action', () => {
    const dummyLogger = { log: jest.fn() }; // dummyLogger es un Stub y también un Dummy en este caso

    const userService = new UserService(dummyLogger);
    userService.createUser('testuser');

    expect(dummyLogger.log).toHaveBeenCalledWith('Creating user: testuser');
  });
});
```

En este caso, dummyLogger actúa como un Dummy para la dependencia Logger del UserService.

**2. Fakes**

* **¿Qué es?** Un Fake es un objeto que tiene una implementación funcional simplificada de una dependencia real.
* Los Fakes tienen implementaciones de trabajo reales, pero generalmente están simplificadas para las pruebas. A menudo se utilizan para reemplazar dependencias que son lentas, difíciles de configurar o que tienen efectos secundarios no deseados en un entorno de prueba (como una base de datos real o un sistema de archivos).
* Propósito: Objetos que tienen implementaciones de trabajo, pero generalmente simplificadas para las pruebas. Por ejemplo, una base de datos en memoria.
* **Analogía:** Una versión casera de un plato gourmet. Tiene los ingredientes principales y un sabor similar, pero la preparación es mucho más sencilla.
* **Ejemplo:** Una implementación en memoria de un repositorio de datos que simula el comportamiento de una base de datos real pero es más rápida y fácil de configurar para las pruebas.
* Ejemplo en Jest: Crear una clase con métodos que simulan el comportamiento real de una dependencia.

```typescript
interface UserRepository {
  save(user: { id: number; username: string }): Promise<void>;
  findById(id: number): Promise<{ id: number; username: string } | null>;
}

class InMemoryUserRepository implements UserRepository {
  private users: { [id: number]: { id: number; username: string } } = {};

  async save(user: { id: number; username: string }): Promise<void> {
    this.users[user.id] = user;
  }

  async findById(id: number): Promise<{ id: number; username: string } | null> {
    return this.users[id] || null;
  }
}

class UserProfileService {
  constructor(private userRepository: UserRepository) {}

  async updateUserProfile(userId: number, newUsername: string) {
    const user = await this.userRepository.findById(userId);
    if (user) {
      await this.userRepository.save({ ...user, username: newUsername });
    }
  }
}

describe('UserProfileService', () => {
  it('should update the username using the fake repository', async () => {
    const fakeUserRepository = new InMemoryUserRepository();
    await fakeUserRepository.save({ id: 1, username: 'olduser' });

    const userProfileService = new UserProfileService(fakeUserRepository);
    await userProfileService.updateUserProfile(1, 'newuser');

    const updatedUser = await fakeUserRepository.findById(1);
    expect(updatedUser).toEqual({ id: 1, username: 'newuser' });
  });
});
```

Aquí, InMemoryUserRepository es un Fake que implementa la interfaz UserRepository.

**3. Stubs**

* **¿Qué es?** Un Stub es un objeto que proporciona entradas controladas a la Unidad Bajo Prueba (SUT).
* Los Stubs proporcionan entradas controladas a la SUT. Se utilizan para simular las respuestas de las dependencias para que puedas probar diferentes escenarios y cómo reacciona la SUT a esas entradas.
* Propósito: Objetos que proporcionan entradas controladas a la SUT durante la prueba. Permiten verificar que la SUT se comporta correctamente en diferentes escenarios de entrada.
* **Analogía:** Un actor de doblaje que proporciona las líneas de otro actor. La SUT espera una respuesta específica y el Stub se la da.
* **Ejemplo:** Un Stub de un servicio de base de datos que siempre devuelve un usuario específico cuando se llama con un ID determinado.
* Ejemplo en Jest: Usar jest.fn() con .mockReturnValue() o .mockResolvedValue().

```typescript

interface PaymentService {
  processPayment(amount: number, userId: number): Promise<boolean>;
}

class OrderService {
  constructor(private paymentService: PaymentService) {}

  async checkout(userId: number, totalAmount: number): Promise<string> {
    const paymentSuccessful = await this.paymentService.processPayment(totalAmount, userId);
    if (paymentSuccessful) {
      return 'Order placed successfully';
    } else {
      throw new Error('Payment failed');
    }
  }
}

describe('OrderService', () => {
  it('should place the order if payment is successful (stubbed)', async () => {
    const successfulPaymentStub = {
      processPayment: jest.fn().mockResolvedValue(true),
    } as PaymentService;

    const orderService = new OrderService(successfulPaymentStub);
    const result = await orderService.checkout(1, 100);
    expect(result).toBe('Order placed successfully');
  });

  it('should throw an error if payment fails (stubbed)', async () => {
    const failedPaymentStub = {
      processPayment: jest.fn().mockResolvedValue(false),
    } as PaymentService;

    const orderService = new OrderService(failedPaymentStub);
    await expect(orderService.checkout(1, 100)).rejects.toThrow('Payment failed');
  });
});
```

successfulPaymentStub y failedPaymentStub son Stubs que controlan el valor de retorno de la dependencia PaymentService.

**4. Spies**

* **¿Qué es?** Un Spy es un objeto que "envuelve" una dependencia real y registra cómo se interactúa con ella.
* Los Spies "envuelven" una dependencia real y registran cómo se interactúa con ella. Puedes verificar cuántas veces se llamó a un método, con qué argumentos, etc. Los Spies no reemplazan el comportamiento real de la dependencia a menos que se indique explícitamente.
* Propósito: Objetos que "espían" una dependencia real, permitiéndonos verificar cómo se interactúa con ella (por ejemplo, cuántas veces se llama un método, con qué argumentos). No reemplazan la implementación real, solo registran la interacción.
* **Analogía:** Un detective encubierto que observa las acciones de alguien sin que esa persona lo sepa.
* **Ejemplo:** Un Spy en un método de envío de correo electrónico para verificar que se haya llamado con los destinatarios y el contenido correctos.
* Ejemplo en Jest: Usar jest.spyOn().

```typescript
const emailService = {
  sendEmail: (to: string, subject: string, body: string) => {
    console.log(`Sending email to ${to}: ${subject}`);
    // ... implementación real para enviar el correo ...
  },
};

class NotificationService {
  constructor(private emailService: typeof emailService) {}

  sendWelcomeEmail(userEmail: string, username: string) {
    this.emailService.sendEmail(userEmail, 'Welcome!', `Hi ${username}, welcome to our platform!`);
  }
}

describe('NotificationService', () => {
  it('should call the email service to send a welcome email (spy)', () => {
    const sendEmailSpy = jest.spyOn(emailService, 'sendEmail');

    const notificationService = new NotificationService(emailService);
    notificationService.sendWelcomeEmail('[dirección de correo electrónico eliminada]', 'Test User');

    expect(sendEmailSpy).toHaveBeenCalledTimes(1);
    expect(sendEmailSpy).toHaveBeenCalledWith(
      '[dirección de correo electrónico eliminada]',
      'Welcome!',
      'Hi Test User, welcome to our platform!'
    );

    sendEmailSpy.mockRestore(); // Limpiar el spy después de la prueba
  });
});
```

sendEmailSpy es un Spy que nos permite verificar que el método sendEmail del objeto emailService fue llamado con los argumentos correctos.

**5. Mocks**

* **¿Qué es?** Un Mock es un objeto que simula una dependencia y también verifica que se interactúe con él de la manera esperada.
* Los Mocks son como Stubs con expectativas. No solo proporcionan entradas controladas, sino que también esperas que se interactúe con ellos de una manera específica. Si las expectativas no se cumplen (por ejemplo, un método no se llama o se llama con los argumentos incorrectos), la prueba fallará.
* Propósito: Objetos que son tanto Stubs como Spies. Están pre*programados con expectativas sobre cómo serán llamados. En Jest, jest.fn() crea un Mock Function.
* **Analogía:** Un director de orquesta que no solo les dice a los músicos qué tocar (Stub), sino que también espera que toquen en un momento específico y de una manera determinada (Expectativa).
* **Ejemplo:** Un Mock de un servicio de pago donde esperas que se llame al método de procesamiento de pagos exactamente una vez con los detalles correctos del pedido.
* Ejemplo en Jest: Usar jest.fn() y sus métodos de aserción (toHaveBeenCalled, toHaveBeenCalledWith, etc.).

```typescript
interface AnalyticsService {
  trackEvent(eventName: string, data?: any): void;
}

class UserServiceWithAnalytics {
  constructor(private analyticsService: AnalyticsService) {}

  createUser(username: string) {
    // ... lógica para crear el usuario ...
    this.analyticsService.trackEvent('user_created', { username });
    return { id: 1, username };
  }
}

describe('UserServiceWithAnalytics', () => {
  it('should track a user creation event (mock)', () => {
    const analyticsServiceMock = {
      trackEvent: jest.fn(),
    } as AnalyticsService;

    const userService = new UserServiceWithAnalytics(analyticsServiceMock);
    userService.createUser('testuser');

    expect(analyticsServiceMock.trackEvent).toHaveBeenCalledTimes(1);
    expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith('user_created', { username: 'testuser' });
  });
});
```

analyticsServiceMock es un Mock que reemplaza la dependencia AnalyticsService y nos permite verificar que su método trackEvent fue llamado con los argumentos esperados.

**Características de Jest para Test Doubles**

Jest proporciona varias funciones convenientes para trabajar con Test Doubles:

- jest.fn(): Crea una función mock. Puedes encadenar métodos como .mockReturnValue(), .mockImplementation(), .mockResolvedValue(), .mockRejectedValue() para controlar su comportamiento.

- .toHaveBeenCalled(), .toHaveBeenCalledWith(args), .toHaveBeenCalledTimes(number): Métodos para realizar aserciones sobre cómo se llamaron las funciones mock.

- jest.spyOn(object, methodName): Crea un spy en un método existente de un objeto. Puedes usar los mismos métodos de aserción que con jest.fn(). No reemplaza la implementación original a menos que lo especifiques con .mockImplementation() o similar.

- jest.mock('module-name', factory?): Permite mockear módulos completos. Puedes proporcionar una función factory para definir la implementación del módulo mock.

- mockImplementationOnce(fn): Permite definir una implementación para la siguiente llamada a una función mock.

**Mejores Prácticas al Usar Test Doubles**
- Usa el Test Double más simple que satisfaga tus necesidades: No siempre necesitas un Mock completo. A veces un Stub o un Spy es suficiente.

- Céntrate en las interacciones, no en la implementación: Verifica que la SUT interactúa con sus dependencias de la manera esperada, en lugar de preocuparte por los detalles internos de las dependencias.

- Asegúrate de que tus Mocks sean realistas: Los Mocks deben simular el comportamiento relevante de las dependencias reales para que tus pruebas sean significativas.
