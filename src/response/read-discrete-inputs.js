let ModbusResponseBody = require('./response-body.js')

/** Read Discrete Inputs Response Body (Function Code 0x02)
 * @extends ModbusResponseBody
 * @class
 */
class ReadDiscreteInputsResponseBody extends ModbusResponseBody {

  /** Create ReadDiscreteInputsResponseBody from Buffer
   * @param {Buffer} buffer
   * @returns ReadDiscreteInputsResponseBody
   */
  static fromBuffer (buffer) {
    let fc = buffer.readUInt8(0)
    let byteCount = buffer.readUInt8(1)
    let coilStatus = buffer.slice(2, 2 + byteCount)

    if (coilStatus.length !== byteCount) {
      return null
    }

    if (fc !== 0x02) {
      return null
    }

    return new ReadDiscreteInputsResponseBody(coilStatus, byteCount)
  }

  /** Creates a ReadDiscreteInputsResponseBody
   * @param {Array} coils Array with Boolean values
   * @param {Number} length Quantity of Coils
   */
  constructor (coils, numberOfBytes) {
    super(0x02)
    this._coils = coils
    this._numberOfBytes = numberOfBytes

    if (coils instanceof Array) {
      this._valuesAsArray = coils
      this._valuesAsBuffer = Buffer.alloc(numberOfBytes)
      for (let i = 0; i < coils.length; i += 1) {
        let byteOffset = Math.floor(i / 8)
        let bitOffset = i % 8
        let byte = this._valuesAsBuffer.readUInt8(byteOffset)

        byte += coils[i] ? Math.pow(2, bitOffset) : 0

        this._valuesAsBuffer.writeUInt8(byte, byteOffset)
      }
    }

    if (coils instanceof Buffer) {
      this._valuesAsBuffer = coils
      this._valuesAsArray = []
      for (let i = 0; i < coils.length * 8; i += 1) {
        let byteOffset = Math.floor(i / 8)
        let bitOffset = i % 8
        let mask = Math.pow(2, bitOffset)
        let byte = this._valuesAsBuffer.readUInt8(byteOffset)
        let value = ((byte & mask) > 0) ? 1 : 0
        this._valuesAsArray.push(value)
      }
    }
  }

  /** Coils */
  get coils () {
    return this._coils
  }

  get valuesAsArray () {
    return this._valuesAsArray
  }

  get valuesAsBuffer () {
    return this._valuesAsBuffer
  }

  /** Length */
  get numberOfBytes () {
    return this._numberOfBytes
  }

  get byteCount () {
    return Math.ceil(this._coils.length / 8) + 3
  }

  createPayload () {
    let payload = Buffer.alloc(this.byteCount)

    payload.writeUInt8(this._fc, 0)
    payload.writeUInt8(this._numberOfBytes, 1)

    this._valuesAsBuffer.copy(payload, 2)

    return payload
  }

}
module.exports = ReadDiscreteInputsResponseBody
