import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYoutube, faInstagram, faTiktok, faChrome } from '@fortawesome/free-brands-svg-icons'

type IconProps = { className?: string; size?: number }

function createIcon(icon: any) {
  return ({ className, size }: IconProps) => (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      style={{ width: size, height: size }}
    />
  )
}

export const YoutubeIcon = createIcon(faYoutube)
export const InstagramIcon = createIcon(faInstagram)
export const TiktokIcon = createIcon(faTiktok)
export const ChromeIcon = createIcon(faChrome)
