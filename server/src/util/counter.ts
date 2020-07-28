import Counter from '../models/Counter'

export default (counterName: string) => {
  return new Promise((resolve, reject) => {
    Counter.findOneAndUpdate({ _id: counterName }, { $inc: { seq: 1 } }, { new: true, upsert: true }, (err, data) => {
      if (!err) resolve(data.seq)
      else reject(err)
    })
  })
}
