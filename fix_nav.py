import re

with open('d:/work/startup portfolio/css/navigation.css', 'r') as f:
    css = f.read()

# 1. BEM Naming Conventions
replacements = {
    r'\.navigation-ui': '.nav',
    r'\.nav-btn': '.nav__btn',
    r'\.back-btn': '.nav__btn--back',
    r'\.nav-controls': '.nav__controls',
    r'\.hamburger-icon': '.nav__hamburger',
    r'\.hamburger-btn': '.nav__btn--hamburger',
    r'\.map-panel': '.map-panel',
    r'\.map-content-clipped': '.map-panel__content',
    r'\.map-header': '.map-panel__header',
    r'\.close-btn': '.map-panel__close-btn',
    r'\.map-container': '.map-panel__container',
    r'\.map-image': '.map-panel__image',
    r'\.map-hover-zone': '.map-panel__hover-zone',
    r'\.map-room-label': '.map-panel__room-label',
    r'\.pin-slot': '.map-panel__pin-slot',
    r'\.pin-marker': '.map-panel__pin-marker',
    r'\.audio-card': '.audio-panel__card',
    r'\.audio-header': '.audio-panel__header',
    r'\.audio-sliders-container': '.audio-panel__sliders',
    r'\.slider-group': '.audio-panel__slider-group',
    r'\.slider-label': '.audio-panel__slider-label',
    r'\.paper-slider': '.audio-panel__slider',
    r'\.achievements-card': '.achievements-panel__card',
    r'\.achievements-header': '.achievements-panel__header',
    r'\.achievement-count': '.achievements-panel__count',
    r'\.achievements-list': '.achievements-panel__list',
    r'\.achievement-item': '.achievements-panel__item',
    r'\.achievement-icon': '.achievements-panel__icon',
    r'\.achievement-text': '.achievements-panel__text',
    r'\.achievement-title': '.achievements-panel__title',
    r'\.achievement-desc': '.achievements-panel__desc',
    r'\.achievement-popup-card': '.achievement-popup__card',
    r'\.achievement-popup-text': '.achievement-popup__text'
}

# sort by length descending to replace longest first
for old, new in sorted(replacements.items(), key=lambda x: len(x[0]), reverse=True):
    css = re.sub(old + r'(?=[^a-zA-Z0-9_-])', new, css)

# 2. Variables (colors, fonts, clips, z-index)
css = css.replace('z-index: 100;', 'z-index: var(--z-dropdown);')
css = css.replace('z-index: 101;', 'z-index: var(--z-sticky);')
css = css.replace('z-index: 102;', 'z-index: var(--z-overlay);')
css = css.replace('z-index: 200;', 'z-index: var(--z-modal);')
css = css.replace('z-index: 90;', 'z-index: var(--z-popup);')
css = css.replace('z-index: 99;', 'z-index: var(--z-dropdown);')
css = css.replace('background-color: #fff;', 'background-color: var(--color-card);')
css = css.replace('color: #1a1a1a;', 'color: var(--color-text);')
css = css.replace('color: #888;', 'color: var(--color-muted);')
css = css.replace('background: #ccc;', 'background: var(--color-border-light);')
css = css.replace('background-color: #ccc;', 'background-color: var(--color-border-light);')
css = css.replace('border-bottom: 2px dashed #ccc;', 'border-bottom: var(--border-dashed-light);')
css = css.replace('border-bottom: 2px dashed #bbb;', 'border-bottom: var(--border-dashed);')
css = css.replace('border: 2px dashed #bbb;', 'border: var(--border-dashed);')
css = css.replace('background: #1a1a1a;', 'background: var(--color-text);')
css = css.replace('background-color: #1a1a1a;', 'background-color: var(--color-text);')
css = css.replace('stroke: #1a1a1a;', 'stroke: var(--color-text);')
css = css.replace('stroke: #fff;', 'stroke: var(--color-card);')
css = css.replace('stroke: #bbb;', 'stroke: var(--color-border);')
css = css.replace('url(\'../textures/paper-texture.png\')', 'var(--texture-paper)')
css = css.replace("font-family: 'Cabin Sketch', 'Patrick Hand', cursive;", "font-family: var(--font-sketch);")
css = css.replace("font-family: 'Patrick Hand', 'Cabin Sketch', cursive;", "font-family: var(--font-hand);")
css = css.replace("font-family: 'Patrick Hand', cursive;", "font-family: var(--font-hand);")
css = css.replace("font-family: 'Cabin Sketch', cursive;", "font-family: var(--font-sketch);")

# 3. Fix rigid panel widths to be fluid
css = re.sub(r'width:\s*220px;', 'width: 90%; max-width: 220px;', css)
css = re.sub(r'width:\s*280px;', 'width: 90%; max-width: 280px;', css)

# 4. Increase touch targets (close-btn, slider thumb) to at least 44px
css = re.sub(r'(\.map-panel__close-btn\s*\{[^}]*?)width:\s*28px;([^}]*?height:\s*)28px;', r'\g<1>width: 44px;\g<2>44px;', css)
css = re.sub(r'(\.audio-panel__slider::-webkit-slider-thumb\s*\{[^}]*?)width:\s*16px;([^}]*?height:\s*)16px;', r'\g<1>width: 44px;\g<2>44px;', css)
css = re.sub(r'(\.audio-panel__slider::-moz-range-thumb\s*\{[^}]*?)width:\s*16px;([^}]*?height:\s*)16px;', r'\g<1>width: 44px;\g<2>44px;', css)

# 5. Fix hard pixel padding/fonts to rem/em
def px_to_rem(match):
    px = float(match.group(1))
    return f"{px/16:g}rem"

props_to_convert = ['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
                    'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
                    'font-size', 'top', 'left', 'right', 'bottom', 'gap', 'border-radius']

for prop in props_to_convert:
    def replacer(m):
        vals = m.group(2).split()
        new_vals = []
        for v in vals:
            if v.endswith('px') and not v.startswith('max-') and not v.startswith('min-'):
                try:
                    px = float(v[:-2])
                    new_vals.append(f"{px/16:g}rem")
                except ValueError:
                    new_vals.append(v)
            else:
                new_vals.append(v)
        return f"{m.group(1)}: {' '.join(new_vals)};"
    
    css = re.sub(r'(' + prop + r')\s*:\s*([^;]+);', replacer, css)

# Fix duplicate clip-path in multiple places
css = re.sub(r'clip-path:\s*polygon\([^;]+;', 'clip-path: var(--clip-torn-paper);', css)

with open('d:/work/startup portfolio/css/navigation.css', 'w') as f:
    f.write(css)
print('Done!')
