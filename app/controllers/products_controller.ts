import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {

  // List all products
  public async index({ response }: HttpContext) {
    const products = await Product.all()
    return response.ok(products)
  }

  // Create a new product
  public async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'amount'])
    const product = await Product.create(data)
    return response.created(product)
  }

  // View a single product
  public async show({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return response.ok(product)
  }

  // Update a product
  public async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = request.only(['name', 'amount'])
    product.merge(data)
    await product.save()
    return response.ok(product)
  }

  // Delete a product
  public async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.noContent()
  }
}
