import p5 from "p5";
import { Pane } from 'tweakpane';
import gsap from 'gsap';

export const sketch = (p: p5) => {
  const gui = new Pane({ title: 'Config' });
  const params = {
    radius: 50,
  }


  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    const param = gui.addBinding(params, 'radius', {min: 10, max: 200, step: 1})
    let isLarge = false;
    gui.addButton({title: 'Animate', }).on('click', () => {
      const p = isLarge ? 20 : 200;
      isLarge = !isLarge;
      gsap.to(params, {radius: p, duration: 1, overwrite: true, ease: 'back.inOut', onComplete: ()=>{
        param.refresh();
      }})
    });
  };

  p.draw = () => {
    p.background(250);
    p.noStroke();
    p.fill(255, 200, 200);
    const r = params.radius;
    p.ellipse(p.width / 2, p.height / 2, r, r);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}
