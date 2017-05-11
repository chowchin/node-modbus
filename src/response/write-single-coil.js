let ModbusResponseBody = require('./response-body.js')

/** Write Single Coil Response Body
 * @extends ModbusResponseBody
 * @class
 */
class WriteSingleCoilResponseBody extends ModbusResponseBody {

  /** Creates a WriteSingleResponseBody from a Buffer
   * @param {Buffer} buffer
   * @returns New WriteSingleResponseBody Object
   */
  static fromBuffer (buffer) {
    let fc = buffer.readUInt8(0)
    let address = buffer.readUInt16BE(1)
    let value = buffer.readUInt16BE(3) === 0xFF00

    if (fc !== 0x05) {
      return null
    }

    return new WriteSingleCoilResponseBody(address, value)
  }

  constructor (address, value) {
    super(0x05)
    this._address = address
    this._value = value
  }

  get address () {
    return this._address
  }

  get value () {
    return this._value
  }

  get byteCount () {
    return 5
  }

  createPayload () {
    let payload = Buffer.alloc(this.byteCount)

    payload.writeUInt8(this._fc, 0)
    payload.writeUInt16BE(this._address, 1)
    payload.writeUInt16BE(this._value, 3)

    return payload
  }
}

module.exports = WriteSingleCoilResponseBody
