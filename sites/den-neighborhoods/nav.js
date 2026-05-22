// Inject shared navigation
(function() {
  var pages = [
    { href: 'index.html', label: 'Overview' },
    { href: 'map.html', label: '🗺 Map' },
    { href: 'wash-park.html', label: 'Wash Park' },
    { href: 'platt-park.html', label: 'Platt Park' },
    { href: 'highland-lohi.html', label: 'Highland / LoHi' },
    { href: 'berkeley.html', label: 'Berkeley' },
    { href: 'sunnyside.html', label: 'Sunnyside' },
    { href: 'congress-park.html', label: 'Congress Park' },
    { href: 'sloans-lake.html', label: "Sloan's Lake" },
    { href: 'baker.html', label: 'Baker' },
    { href: 'south-park-hill.html', label: 'South Park Hill' },
    { href: 'bonnie-brae.html', label: 'Bonnie Brae' },
  ];

  var current = window.location.pathname.split('/').pop() || 'index.html';

  var linksHtml = pages.map(function(p) {
    var cls = (p.href === current) ? ' class="active"' : '';
    return '<li><a href="' + p.href + '"' + cls + '>' + p.label + '</a></li>';
  }).join('');

  var navHtml = '<nav class="site-nav"><div class="nav-inner">' +
    '<a href="index.html" class="nav-home">Denver Neighborhoods</a>' +
    '<ul class="nav-links">' + linksHtml + '</ul>' +
    '</div></nav>';

  document.write(navHtml);
})();
