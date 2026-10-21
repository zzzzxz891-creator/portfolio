import { useEffect, useRef } from 'react';
import photoManifest from './photos.json';
import { assetPath } from './site-paths.js';
import { MOTION, sampleSegment, scaleAt, stampSpacing } from './trail-motion';

const photos = photoManifest.map(photo => ({ ...photo, src: assetPath(`/assets/photos/${photo.filename}`) }));

export function PhotoTrail() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current, hero = canvas.closest('.hero'), context = canvas.getContext('2d');
    if (!context) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width=0, height=0, density=1, cardWidth=0, cardHeight=0, items=[], next=0, count=0;
    let frame=0, lastInput=null, carried=0, pending=[], alive=true;
    const images=photos.map(photo=>{const img=new Image();img.src=photo.src;return img;});

    const queuePaint=()=>{if(alive&&!frame)frame=requestAnimationFrame(paint);};
    const spawn=(point,now=performance.now())=>{
      if(!alive)return;
      const index=next++%photos.length;
      const item={index,x:point.x,y:width<650?Math.max(point.y,height*.66):point.y,born:now,static:reduce.matches};
      items=reduce.matches?[item]:[...items.slice(-(MOTION.maxItems-1)),item];
      hero.dataset.trailCount=String(++count);hero.dataset.lastPhoto=String(index);
      queuePaint();
    };

    function paint(now) {
      frame=0;if(!alive)return;
      for(const point of pending){
        if(!lastInput)spawn(point,point.at);
        else {
          const segment=sampleSegment(lastInput,point,carried,stampSpacing(cardWidth));
          for(const sample of segment.samples)spawn(sample,sample.at);
          carried=segment.carried;
        }
        lastInput=point;
      }
      pending=[];
      context.setTransform(density,0,0,density,0,0);context.clearRect(0,0,width,height);
      items=items.filter(item=>item.static || now-item.born<MOTION.duration);
      const ages=items.map(item=>item.static?MOTION.grow:Math.max(0,now-item.born));
      const scales=ages.map(scaleAt);
      canvas.dataset.activeCount=String(items.length);
      canvas.dataset.activePhotos=items.map(item=>item.index).join(',');
      canvas.dataset.phases=ages.map(age=>age<MOTION.grow?'grow':age<MOTION.grow+MOTION.hold?'hold':'shrink').join(',');
      canvas.dataset.scales=scales.map(scale=>scale.toFixed(3)).join(',');
      canvas.dataset.ages=ages.map(age=>Math.round(age)).join(',');
      canvas.dataset.positions=items.map(item=>`${item.x.toFixed(1)}:${item.y.toFixed(1)}`).join(',');
      canvas.dataset.cardWidth=cardWidth.toFixed(2);canvas.dataset.cardHeight=cardHeight.toFixed(2);
      canvas.dataset.spacing=stampSpacing(cardWidth).toFixed(2);
      canvas.dataset.readyCount=String(images.filter(image=>image.complete&&image.naturalWidth).length);
      context.save();
      if(width<650){context.beginPath();context.rect(0,height*.51,width,height*.33);context.clip();}
      let drawn=0;
      items.forEach((item,i)=>{
        const image=images[item.index];if(!image.complete||!image.naturalWidth)return;
        const scale=scales[i],drawWidth=cardWidth*scale,drawHeight=cardHeight*scale;
        if(drawWidth<.4||drawHeight<.4)return;
        const sourceRatio=image.naturalWidth/image.naturalHeight;
        let sw=image.naturalWidth,sh=image.naturalHeight;
        if(sourceRatio>MOTION.aspect)sw=sh*MOTION.aspect;else sh=sw/MOTION.aspect;
        context.drawImage(image,(image.naturalWidth-sw)/2,(image.naturalHeight-sh)/2,sw,sh,item.x-drawWidth/2,item.y-drawHeight/2,drawWidth,drawHeight);
        drawn++;
      });
      context.restore();canvas.dataset.drawnCount=String(drawn);
      if(items.some(item=>!item.static)||pending.length)queuePaint();
    }
    const resetInput=()=>{pending=[];lastInput=null;carried=0;};
    const resize=()=>{
      const box=hero.getBoundingClientRect(),oldWidth=width,oldHeight=height;
      width=box.width;height=box.height;
      cardWidth=width<650?125:Math.min(190,Math.max(142,width*.132));cardHeight=cardWidth/MOTION.aspect;
      if(oldWidth&&oldHeight)items=items.map(item=>({...item,x:item.x*width/oldWidth,y:item.y*height/oldHeight}));
      density=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*density);canvas.height=Math.round(height*density);
      resetInput();queuePaint();
    };
    const observer=new ResizeObserver(resize);observer.observe(hero);resize();
    const move=event=>{
      if(event.pointerType==='touch'||reduce.matches)return;
      if(event.target.closest('a,button')){resetInput();return;}
      const box=hero.getBoundingClientRect(),now=performance.now();
      const coalesced=event.getCoalescedEvents?.();
      for(const sample of coalesced?.length?coalesced:[event]){
        const at=Math.abs(sample.timeStamp-now)<1000?sample.timeStamp:now;
        pending.push({x:sample.clientX-box.left,y:sample.clientY-box.top,at});
      }
      queuePaint();
    };
    const tap=event=>{if(event.pointerType!=='touch'||event.target.closest('a,button'))return;const box=hero.getBoundingClientRect();spawn({x:event.clientX-box.left,y:event.clientY-box.top});};
    hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',resetInput);hero.addEventListener('pointerdown',tap,{passive:true});
    const visibility=()=>{if(document.hidden){items=[];resetInput();queuePaint();}};document.addEventListener('visibilitychange',visibility);
    return()=>{
      alive=false;cancelAnimationFrame(frame);observer.disconnect();
      hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',resetInput);hero.removeEventListener('pointerdown',tap);document.removeEventListener('visibilitychange',visibility);
    };
  },[]);
  return <canvas className="trail-layer" ref={canvasRef} aria-hidden="true" />;
}
