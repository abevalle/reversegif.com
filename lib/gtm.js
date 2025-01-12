export const GTM_ID = 'GTM-N62FBMQP'

export const pageview = (url) => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  })
}

export const event = ({ action, category, label, value }) => {
  window.dataLayer.push({
    event: 'customEvent',
    eventAction: action,
    eventCategory: category,
    eventLabel: label,
    eventValue: value,
  })
}
