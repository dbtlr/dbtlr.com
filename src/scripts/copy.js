// Copy buttons for code blocks
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.code-copy');
  if (!btn) return;
  var pre = btn.closest('.code').querySelector('pre');
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(function () {
    btn.textContent = 'Copied';
    btn.classList.add('ok');
    setTimeout(function () {
      btn.textContent = 'Copy';
      btn.classList.remove('ok');
    }, 1600);
  });
});
