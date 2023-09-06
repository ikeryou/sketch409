import { LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, Object3D, Vector3 } from "three"
import { MyObject3D } from "../webgl/myObject3D"
import { Util } from "../libs/util"

export class Item extends MyObject3D {

  public itemId:number = 0

  private _line: LineSegments
  private _fill: Mesh
  private _con: Object3D
  private _scale: Vector3 = new Vector3()
  private _t:number = 0

  public centerDist:number = 0


  constructor(opt:any = {}) {
    super()

    this._con = new Object3D()
    this.add(this._con)

    this.itemId = opt.id
    this._t = this.itemId * 10

    this._scale.x = opt.scale

    this._fill = new Mesh(
      opt.fillGeo,
      new MeshBasicMaterial({
        color:this.itemId % 2 == 0 ? 0xffff00 : 0x000000,
        // depthTest:false,
      })
    )
    this._con.add(this._fill)

    this._line = new LineSegments(
      opt.lineGeo,
      new LineBasicMaterial({
        color:this.itemId % 2 == 0 ? 0x000000 : 0xffff00,
        // depthTest:false,
      })
    )
    this._con.add(this._line)

    if(Util.hit()) {
      // this._fill.visible = false
      // this._fill.position.y = this._line.position.y = -0.5
    } else {
      // this._fill.position.y = this._line.position.y = 0.5
    }

    // if(this.itemId % 2 == 0) {
    //   this._con.visible = this._line.visible = false
    // }

    this._resize()
  }


  public setSize(val:number):void {
    const kake = 1
    this.scale.set(val * kake, val, val * kake)
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    // if(this.itemId % 2 == 0) return

    this._t += 6

    const radian = Util.radian(this._t)
    this._con.scale.y = Util.map(Math.sin(radian), 0.8, 0.3 + this.centerDist, -1, 1)
    // this._con.scale.z = Util.instance.map(Math.cos(radian), 0.2, 1, -1, 1)

    // this._con.position.y = Util.instance.map(Math.sin(radian), -this._noise.y, this._noise.y, -1, 1)
  }
}