/** In-page confirmation dialog (browser confirm() is blocked in some embeds). */
export function ask(message: string, okLabel = 'Yes, continue'): Promise<boolean> {
  return new Promise((resolve) => {
    const back = document.createElement('div')
    back.className = 'ask-backdrop'
    back.innerHTML = `<div class="ask-box" role="dialog" aria-modal="true"><p></p><div class="row" style="justify-content:flex-end"><button type="button" data-v="0">Cancel</button><button type="button" class="primary" data-v="1"></button></div></div>`
    back.querySelector('p')!.textContent = message
    back.querySelector('[data-v="1"]')!.textContent = okLabel
    const done = (v: boolean) => {
      back.remove()
      document.removeEventListener('keydown', onKey)
      resolve(v)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && done(false)
    back.addEventListener('click', (e) => {
      const t = e.target as HTMLElement
      if (t === back) done(false)
      else if (t.dataset.v) done(t.dataset.v === '1')
    })
    document.addEventListener('keydown', onKey)
    document.body.appendChild(back)
    ;(back.querySelector('[data-v="1"]') as HTMLButtonElement).focus()
  })
}
