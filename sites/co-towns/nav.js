/* nav.js — injects sticky navigation on every town page */
(function () {
  const towns = [
    { name: 'Overview',         href: 'index.html',           home: true },
    { name: '🗺 Map',           href: 'map.html',             map: true },
    { name: 'Steamboat Spgs',   href: 'steamboat.html' },
    { name: 'Glenwood Spgs',    href: 'glenwood.html' },
    { name: 'Carbondale',       href: 'carbondale.html' },
    { name: 'Salida',           href: 'salida.html' },
    { name: 'Buena Vista',      href: 'buena-vista.html' },
    { name: 'Frisco',           href: 'frisco.html' },
    { name: 'Edwards',          href: 'edwards.html' },
    { name: 'Crested Butte',    href: 'crested-butte.html' },
    { name: 'Colorado Spgs',    href: 'colorado-springs.html' },
    { name: 'Fort Collins',     href: 'fort-collins.html' },
    { name: 'Manitou Spgs',     href: 'manitou.html' },
    { name: 'Loveland',         href: 'loveland.html' },
    { name: 'Grand Junction',   href: 'grand-junction.html' },
    { name: 'Winter Park',      href: 'winter-park.html' },
    { name: 'Breckenridge',     href: 'breckenridge.html' },
    { name: 'Telluride',        href: 'telluride.html' },
    { name: 'Ouray',            href: 'ouray.html' },
    { name: 'Ridgway',          href: 'ridgway.html' },
    { name: 'Leadville',        href: 'leadville.html' },
    { name: 'Durango',          href: 'durango.html' },
    { name: 'Nederland',        href: 'nederland.html' },
    { name: 'Basalt',           href: 'basalt.html' },
    { name: 'Pagosa Springs',   href: 'pagosa.html' },
    { name: 'Marble',           href: 'marble.html' },
    { name: 'Castle Rock',      href: 'castle-rock.html' },
  ];

  const nav = document.createElement('nav');
  const cur = location.pathname.split('/').pop() || 'index.html';

  towns.forEach(t => {
    const a = document.createElement('a');
    a.href = t.href;
    a.textContent = t.name;
    if (t.home) a.classList.add('home-link');
    if (t.map)  a.classList.add('map-link');
    if (t.href === cur) a.classList.add('active');
    nav.appendChild(a);
  });

  document.body.insertBefore(nav, document.body.firstChild);

  /* Scroll active link into view */
  const active = nav.querySelector('.active');
  if (active) active.scrollIntoView({ inline: 'center', block: 'nearest' });
})();
