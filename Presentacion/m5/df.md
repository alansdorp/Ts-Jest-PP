---

## Diferencias entre Stubs, Mocks, Fakes, Dummies y Spies en Pruebas

Los términos Stub, Mock, Fake, Dummy y Spy se utilizan para describir diferentes tipos de **Test Doubles**, que son objetos o funciones que reemplazan las dependencias reales de la Unidad Bajo Prueba (SUT) en las pruebas. Comprender las diferencias entre ellos es crucial para escribir pruebas efectivas y bien aisladas.

---

### Tabla Comparativa

| Característica   | Dummy                                  | Stub                                       | Spy                                          | Mock                                            | Fake                                         |
| :--------------- | :------------------------------------- | :----------------------------------------- | :------------------------------------------- | :---------------------------------------------- | :------------------------------------------- |
| **Propósito** | Pasar como argumento, no se usa realmente | Proporcionar entradas controladas a la SUT | Observar y registrar interacciones con la SUT | Verificar interacciones y proporcionar comportamiento | Tener una implementación funcional simplificada |
| **Comportamiento** | Pasivo                                   | Proporciona salidas predefinidas           | Observa el comportamiento real                | Comportamiento predefinido y expectativas      | Implementación simplificada pero funcional   |
| **Verificación** | No se verifica                           | Raramente se verifica directamente         | Se verifica la interacción (llamadas, args)   | Se verifica la interacción y el comportamiento | Puede o no verificarse                         |
| **Complejidad** | Simple                                   | Más complejo que un Dummy                 | Más complejo que un Stub                   | Más complejo que un Spy                       | Puede variar en complejidad                    |
| **Uso Común** | Rellenar parámetros necesarios           | Simular respuestas de dependencias          | Verificar cómo se usa una dependencia real   | Simular dependencias y verificar su uso       | Reemplazar dependencias lentas o complejas    |

---

