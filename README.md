# Aluxion / Upload File

![Logo](https://media.licdn.com/dms/image/v2/D4D0BAQFTFde2f1cTrA/company-logo_100_100/company-logo_100_100/0/1706036193820/aluxion_logo?e=1746662400&v=beta&t=euZs3EXZS4m8grM9AKUjJ8oXeFMjsrLMwuW8N7otHuQ)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Installation

Install project with yarn

```bash
yarn install
````

## Development

```
yarn start:dev
```

## Production

```
yarn start
```

## Build

```
yarn build
```

## Testing

Unit testing component
```
yarn test
```

## Puntos a cubrir 💯

- Login- Registro (Con la contraseña encriptada) ✅
- Olvide contraseña con envío de email. ✅
- Subida de archivos (AWS S3) ✅
- Bajada de archivos (AWS S3) 🛑 -> (Acceso denegado fue la respuesta de AWS al tratar de bajar un archivo de S3)
- Gestor de archivos donde puedes: cambiar nombre y obtener enlace de archivo. (AWS S3) 🛑 -> (Acceso denegado fue la respuesta de AWS al tratar de renombrar un archivo de S3)
- Integrar un buscador de imagenes online usando una API externa (Unsplash por ejemplo) ✅
- Subir una imagen proveniente de una API externa directo a S3 (Es decir, sin que el usuario tenga que bajar la imagen en su local y luego subirla manualmente) ✅
- Sistema que mejor consideres para el tipo de estructura en base de datos ✅
- Servicio de OAuth mediante Token. ✅
- Pruebas unitarias (Jest) ✅
- Uso de Docker y NestJS ✅
- Documentación de servicios con SWAGER. ✅
- Arquitectura escalable ✅

_Corre las pruebas automatizadas y pruebas en api rest, no es necesario usar un cliente o interfaz de usuario para probar los puntos de entrada de cada petición._


- [Jwt io](https://jwt.io/) - Como funciona un token de json web token (jwt)
- [Como funciona un jwt](https://openwebinars.net/blog/que-es-json-web-token-y-como-funciona/) - Recursos de jwt

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

### Pre-requisitos 📋

_Que cosas necesitas para instalar el software y como instalarlas_

- [Nvm](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) - Manejo de version para node
- [Node](https://nodejs.org/es/) - Entorno de ejecución javascript (version recomendada: 20.18.1)

- [S3](https://aws.amazon.com/es/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all) - S3 AWS

## Construido con 🛠️

_Para el desarrollo de esta api rest se utilizo las siguientes herramientas._

- [Nest js](https://nestjs.com/) - Framework web multi propósito.
- [Jest](https://jestjs.io/) - Librería para pruebas unitarias y ent to end.
- [Jwt](https://jwt.io/) - Auth basado en token.
- [TypeScript](https://www.typescriptlang.org/) - Tipado fuerte para javascript.
- [Send Grid](https://sendgrid.com/) - Servicio para envíos de email.


## Autores ✒️

- **Andrés Coello** - _Developer full stack_ - [Andres Coello](https://www.instagram.com/coellogoyes/)

#### 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://andres-coello-goyes.vercel.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andr%C3%A9s-roberto-coello-goyes/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/AndresC79085858)

## Expresiones de Gratitud 🎁

- Pásate por mi perfil para ver algún otro proyecto 📢
- Desarrollemos alguna app juntos, puedes escribirme en mis redes.
- Muchas gracias por pasarte por este proyecto 🤓.

---

⌨️ con ❤️ por [Andres Coello](https://www.instagram.com/coellogoyes/) 😊
