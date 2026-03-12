// import type { HttpContext } from '@adonisjs/core/http'
// import env from '#start/env'

// const apiURL = env.get('API_URL')

// export default class PhonesController {
//   public async index({ response }: HttpContext) {
//     try {
//       const res = await fetch(apiURL)
//       if (!res.ok) {
//         return response.status(res.status).send({
//           message: 'Error fetching phones from external API',
//           status: res.status,
//         })
//       }
//       const data = await res.json()
//       return response.json(data)
//     } catch (error) {
//       return response.status(500).send({
//         message: 'Internal server error',
//         error: error.message,
//       })
//     }
//   }

//   public async store({ request, response }: HttpContext) {
//     try {
//         const body = request.body()
       



//         const res = await fetch(apiURL, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(body),
//         })
//          if (!res.ok) {
//         return response.status(res.status).send({
//           message: 'Error al crear registro',
//           status: res.status,
//         })
//       }
//       const data = await res.json()
//       return response.status(201).json(data)
//     } catch (error) {}
//   }


//   public async show({ params, response }: HttpContext) {
//     try {
//         const recordUrl = `${apiURL}/${params.id}`
//         const res = await fetch(recordUrl)
//         if (!res.ok) {
//           return response.status(res.status).send({
//             message: 'Error al obtener registro con id ${params.id}',
//             status: res.status,
//           })
//         }
//         const data = await res.json()
//         return response.json(data)
//     } catch (error) {
//         return response.status(500).send({
//             message: 'Error interno del servidor',
//             error: error.message,
//         })
        
//     }
//   }

//   public async update({}: HttpContext) {}

//   public async destroy({}: HttpContext) {}
// }
