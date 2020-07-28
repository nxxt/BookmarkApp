import Express from 'express'

export default (req: Express.Request) => {
  const auth = req.headers['authorization']
  if (auth) return auth.split(' ')[1]
  else return null
}
