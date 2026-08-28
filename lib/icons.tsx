import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYoutube, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons'

type IconProps = { className?: string; size?: number }

function createIcon(icon: any) {
  function SocialIcon({ className, size }: IconProps) {
    return (
      <FontAwesomeIcon
        icon={icon}
        className={className}
        style={{ width: size, height: size }}
      />
    )
  }
  SocialIcon.displayName = 'SocialIcon'
  return SocialIcon
}

export const YoutubeIcon = createIcon(faYoutube)
export const InstagramIcon = createIcon(faInstagram)
export const TiktokIcon = createIcon(faTiktok)
