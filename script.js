const main = document.querySelector('main');
const items = [
  { id: "https://cdn.jsdelivr.net/gh/justanni/image-gallery/Ml%20image.jpg", title: "Machine Learning", info: "Expertise in designing and implementing algorithms to analyze data and build predictive models." },
  { id: "https://cdn.jsdelivr.net/gh/justanni/image-gallery/Ai%20image.jpg", title: "Artificial Intelligence", info: "Skilled in developing intelligent systems using AI frameworks and tools." },
  { id: "https://cdn.jsdelivr.net/gh/justanni/image-gallery/python%20image.jpg", title: "Python", info: "Proficient in Python programming for automation, data analysis, and application development." },
  { id: "https://cdn.jsdelivr.net/gh/justanni/image-gallery/netsuitef.jpg", title: "Oracle Netsuite", info: "Proficient in managing ERP solutions for streamlined business operations." },
  { id: "https://cdn.jsdelivr.net/gh/justanni/image-gallery/excel%20image.jpeg", title: "Advanced Excel", info: "Expertise in creating dynamic dashboards, data analysis, and financial modeling." },
  { id: "https://cdn.jsdelivr.net/gh/justanni/image-gallery/power%20bi%20image.jpeg", title: "Power BI", info: "Proficient in creating interactive dashboards and visualizations to drive data-driven decision-making." },
  { id: "https://raw.githubusercontent.com/justanni/image-gallery/refs/heads/main/sql.jfif", title: "SQL", info: "Skilled in writing complex queries for database management and data extraction." }
];

items.forEach((itemData, i) => { 
  let item = document.querySelector('.item').cloneNode(true);
  if (i === 0) item = document.querySelector('.item');

  const txt = item.querySelector('.txt');
  const thumb = item.querySelector('.thumb');
  const img = thumb.querySelector('img');
  const overlay = item.querySelector('.overlay');
  const hit = item.querySelector('.hit');

  // Check if id is a valid URL and set image source accordingly
  const imageUrl = (typeof itemData.id === 'string' && itemData.id.startsWith('http')) ? itemData.id : `https://picsum.photos/id/${itemData.id}/650/250/`;

  // Set unique image, title, and text
  main.append(item);
  gsap.set(img, { attr: { src: imageUrl } });
  txt.querySelector('h2').textContent = itemData.title;
  txt.querySelector('.item-info').textContent = itemData.info;

  gsap.fromTo(img, { xPercent: -18 }, {
    scrollTrigger: {
      trigger: item,          
      start: '0 100%',
      end: '100% 0',
      horizontal: true,
      scrub: 0
    },
    xPercent: 0,
    ease: 'none'
  });

  item.onpointerenter = (e) => {
    gsap.to(overlay, { opacity: 0.5 });
    gsap.to(img, { duration: 0.3, scale: 1.2, overwrite: 'auto', ease: 'back' });
    gsap.to(item.querySelector('h2'), { color: 'rgb(160,180,225)' });
    gsap.to(item.querySelector('.item-info'), { opacity: 0.6 });
    gsap.to([thumb, txt], { ease: 'power3', yPercent: (i) => [-6, 2][i], overwrite: 'auto' });
  };

  item.onpointermove = (e) => {
    const xp = gsap.utils.interpolate(-40, 20, e.offsetX / 500);
    const yp = gsap.utils.interpolate(-40, 40, e.offsetY / 400);
    gsap.to(overlay, { duration: 0.7, ease: 'power2', x: xp * 4, y: yp * 4 });
    gsap.to([hit, thumb], { duration: 0.7, ease: 'power2', x: xp, y: yp });
    gsap.to([img], { duration: 0.7, ease: 'power2', x: -xp / 1.3, y: -yp / 1.3 });
    gsap.to(txt, { duration: 0.7, x: xp, y: yp });
  };

  item.onpointerleave = (e) => {
    gsap.to(overlay, { opacity: 0, x: 0, y: 0, overwrite: 'auto' });
    gsap.to(img, { duration: 0.3, scale: 1, x: 0, y: 0, overwrite: 'auto' });
    gsap.to(item.querySelector('h2'), { color: 'rgb(255,255,255)' });
    gsap.to(item.querySelector('.item-info'), { opacity: 0.2 });
    gsap.to([hit, thumb, txt], { duration: 0.7, x: 0, y: 0, yPercent: 0, ease: 'elastic.out(0.8)', overwrite: 'auto' });
  };
});

// stagger reveal
gsap.timeline()
  .to('main', { opacity: 1 })
  .from('.item', { x: innerWidth, skewX: 20, stagger: 0.2, duration: 1, ease: 'elastic.out(0.3)' }, 0.4)
  .from('.txt', { x: innerWidth, stagger: 0.2, duration: 1, ease: 'elastic.out(0.2)' }, 0.44)
  .set('main', { pointerEvents: 'auto' }, 1) //enable mouse interaction
  .add(() => {
    Observer.create({
      target: window,
      type: 'wheel',
      onChangeY: (s) => document.documentElement.scrollLeft += s.deltaY
    });

    ScrollTrigger.create({
      horizontal: true,
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / 500);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.9,
            ease: 'elastic',
            overwrite: true,
            onUpdate: () => {
              skewSetter(proxy.skew);
              txtSetter(proxy.skew * 9);
            }
          });
        }
      }
    });

    gsap.set('.item', { transformOrigin: '50% 0' });
    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".item", "skewX", "deg"),
        txtSetter = gsap.quickSetter(".txt", "x", "px"),
        clamp = gsap.utils.clamp(-6, 6);
  }, 1);
