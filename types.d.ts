// types.d.ts
export type RouteContext = {
    params: { [key: string]: string }
    Params: { [id: string]: string }
  }

  export type Paste = {
    _id: string
    name: string
    info: string
    createdAt: string
  }
  