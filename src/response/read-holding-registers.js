let ModbusResponseBody = require('./response-body.js')

/** Read Holding Registers ResponseBody (Function Code 0x03)
 * @extends ModbusResponseBody
 * @class
 */
class ReadHoldingRegistersResponseBody extends ModbusResponseBody {

  /** Create ReadHoldingRegistersResponseBody from Buffer
   * @param {Buffer} buffer
   * @returns ReadHoldingRegistersResponseBody
   */
  static fromBuffer (buffer) {
    let fc = buffer.readUInt8(0)
    let byteCount = buffer.readUInt8(1)
    let payload = buffer.slice(2, 2 + byteCount)

    if (fc !== 0x03) {
      return null
    }

    let values = []
    for (let i = 0; i < byteCount; i += 2) {
      values.push(payload.readUInt16BE(i))
    }

    return new ReadHoldingRegistersResponseBody(byteCount, values)
  }

  constructor (byteCount, values) {
    super(0x03)
    this._byteCount = byteCount
    this._values = values

    if (values instanceof Array) {
      this._valuesAsArray = values
    }

    if (values instanceof Buffer) {
      this._valuesAsBuffer = values
    }
  }

  get byteCount () {
    return this._values.length * 2 + 2
  }

  get values () {
    return this._values
  }

  get valuesAsArray () {
    return this._valuesAsArray
  }

  get valuesAsBuffer () {
    return this._valuesAsBuffer
  }

  get length () {
    return this._values.length * 2
  }

  createPayload () {
    let payload = Buffer.alloc(this._byteCount)

    payload.writeUInt8(this._fc, 0)
    payload.writeUInt8(this._length, 1)
    this._values.forEach(function (value, i) {
      payload.writeUInt16BE(value, 2 + i)
    })

    return payload
  }

}

module.exports = ReadHoldingRegistersResponseBody
