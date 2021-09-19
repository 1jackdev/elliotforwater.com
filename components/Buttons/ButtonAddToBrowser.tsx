import React, { useEffect, useState } from 'react'
import ButtonPrimary from './ButtonPrimary/ButtonPrimary'
import useTranslation from 'next-translate/useTranslation'
import config from '../../appConfig'
import { isBrowser, isChrome, isFirefox } from 'react-device-detect'

const buttonInfo = {
  chrome: {
    url: config.CHROME_EXTENSION_URL,
    label: 'common:addToChrome',
  },
  firefox: {
    url: config.FF_EXTENSION_URL,
    label: 'common:addToFirefox',
  },
}

declare global {
  interface Window {
    extensionInterface: any
  }
}

export default function ButtonAddToBrowser() {
  const { t } = useTranslation()
  const [browserName, setBrowserName] = useState('')

  useEffect(() => {
    if (isBrowser && isChrome) {
      /* eslint-disable no-undef */
      if (chrome.runtime) {
        chrome.runtime.sendMessage(
          /* eslint-enable no-undef */
          config.CHROME_EXTENSION_ID,
          {
            action: 'id',
            value: config.CHROME_EXTENSION_ID,
          }
        )

        // chrome.runtime.onMessage.addListener((res) => {
        //   if(res.message === 'extension_installed') {
        //     setBrowserName('chrome')
        //   }
        // })
      }
    }

    if (isFirefox) {
      console.log('firefox')

      // check msg from extension content-script.js
      if (
        window.extensionInterface?.target === 'content-script-ff' &&
        window.extensionInterface?.message === 'installed'
      ) {
        console.log('extension installed')
        setBrowserName('firefox')
      }
    }
  }, [])

  return (
    <div className='hideSmallScreen'>
      {browserName !== '' && (
        <ButtonPrimary size='big' linkHref={buttonInfo[browserName].url}>
          {t(buttonInfo[browserName].label)}
        </ButtonPrimary>
      )}
      <style jsx>
        {`
          .hideSmallScreen {
            display: none;
          }

          @media (min-width: 768px) {
            .hideSmallScreen {
              display: block;
            }
          }
        `}
      </style>
    </div>
  )
}
