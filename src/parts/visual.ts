import { EdgesGeometry, Object3D, SphereBufferGeometry } from "three"
import { Canvas } from "../webgl/canvas"
import { Item } from "./item"
import { Func } from "../core/func"
import { Param } from "../core/param"
import { Util } from "../libs/util"
import { MousePointer } from "../core/mousePointer"
import { Update } from "../libs/update"

export class Visual extends Canvas {

  private _allCon: Object3D
  private _con:Array<Object3D> = []
  private _item:Array<Array<Item>> = []
  private _speed: number = 1

  constructor(opt:any) {
    super(opt)

    this._allCon = new Object3D()
    this.mainScene.add(this._allCon)

    // const lineGeo = new EdgesGeometry(new BoxBufferGeometry(1, 1, 1))
    // const fillGeo = new BoxBufferGeometry(1, 1, 1)
    const lineGeo = new EdgesGeometry(new SphereBufferGeometry(1, 12, 5))
    const fillGeo = new SphereBufferGeometry(1, 12, 12)

    const num = 20
    for(let i = 0; i < num; i++) {
      const con = new Object3D()
      this._allCon.add(con)
      this._con.push(con)

      this._item.push([])

      const num2 = num
      for(let i2 = 0; i2 < num2; i2++) {
        const item = new Item({
          id:i2 + i,
          conId:i,
          lineGeo:lineGeo,
          fillGeo:fillGeo
        })
        con.add(item)
        this._item[i].push(item)
      }
    }

    this._allCon.rotation.x = Util.radian(45)
    this._allCon.rotation.y = Util.radian(-45)

    this._resize()
  }


  _update():void {
    const w = this.renderSize.width
    const h = this.renderSize.height

    const mx = MousePointer.instance.easeNormal.x * w * 0.25
    const my = MousePointer.instance.easeNormal.y * h * -0.25

    this._allCon.rotation.z += this._speed * 0.01

    if(Update.instance.cnt % 60 === 0) {
      Param.instance.block.size.value = Util.randomInt(10, 100)
      Param.instance.block.max.value = Util.randomInt(20, 40)
      Param.instance.block.maxRange.value = Util.randomInt(10, 40)
      this._allCon.rotation.z = Util.radian(Util.range(180))
      this._speed = Util.range(1.5)
    }

    const yMargin = 1
    const size = Param.instance.block.size.value * 0.001
    const itemSize = w * size
    this._item.forEach((val,i) => {
      val.forEach((val2,i2) => {
        val2.setSize(itemSize)
        val2.position.z = i * -(itemSize * yMargin) + (itemSize * yMargin * this._item.length * 0.5)
        val2.position.x = i2 * itemSize - (itemSize * val.length * 0.5)

        const dz = mx - val2.position.z
        const dx = my - val2.position.x

        // val2.centerDist = Math.sqrt(val2.position.z * val2.position.z + val2.position.x * val2.position.x)
        val2.centerDist = Math.sqrt(dz * dz + dx * dx)
        val2.centerDist = Util.map(val2.centerDist, Param.instance.block.max.value, 0, 0, w * (Param.instance.block.maxRange.value * 0.01))
      })
    })

    if(this.isNowRenderFrame()) {
      this._render()
    }
  }

  _render():void {
    this.renderer.setClearColor(Param.instance.block.bgColor.value, 1)
    this.renderer.render(this.mainScene, this.cameraOrth)
  }

  isNowRenderFrame():boolean {
    return true
  }

  _resize():void {
    super._resize()

    const w = Func.sw()
    const h = Func.sh()

    this.renderSize.width = w
    this.renderSize.height = h

    this._updateOrthCamera(this.cameraOrth, w, h)

    let pixelRatio:number = window.devicePixelRatio || 1
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(w, h)
    this.renderer.clear()
  }
}