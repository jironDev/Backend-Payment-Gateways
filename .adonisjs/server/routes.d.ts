import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {

}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}