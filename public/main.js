const main = () => {
  // retrieve and load astronomical picture of the day (apod).
  loadApod()
  loadLaunches()
}

// Globalish Variables
const upcomingLaunches = []
let currentLaunchIndex = 0
let countDownIntervalID = null
let autoChangeIntervalID = null

// retrieve and display apod
const loadApod = () => {
  const apiUrl = 'https://sdg-astro-api.herokuapp.com/api/Nasa/apod'
  fetchApod(apiUrl)
}

// retrieve and display launches
const loadLaunches = () => {
  //
  const apiUrl =
    'https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming'
  fetchLaunches(apiUrl)
}

// Fetch apod image info via API, add to page if successful
const fetchApod = async apiUrl => {
  const response = await fetch(apiUrl)
  if ((response.status = 200)) {
    const apodData = await response.json()
    addApodToPage(apodData)
  } else {
    console.log('Oops @ APOD API')
  }
}

// Fetch launch data via API, add to page if successful
const fetchLaunches = async apiUrl => {
  const response = await fetch(apiUrl)
  if ((response.status = 200)) {
    const launchData = await response.json()
    // populate upcomingLaunches array
    popUpcomingLaunches(launchData)
    displayLaunchDetail(currentLaunchIndex)
  } else {
    console.log('Oops @ Launch API')
  }
}
// Populates the upcoming launches array
const popUpcomingLaunches = launchData => {
  for (let i = 0; i <= launchData.length - 1; i++) {
    let launchDetail = {
      title: '',
      description: '',
      launchDate: '',
      location: '',
    }
    launchDetail.title = launchData[i].mission_name
    launchDetail.description = launchData[i].details
    launchDetail.launchDate = new Date(launchData[i].launch_date_utc)
    launchDetail.location = launchData[i].launch_site.site_name_long
    upcomingLaunches.push(launchDetail)
  }
}

// this function adds the picture of the day as
// the background and populates the copyright information
const addApodToPage = apodData => {
  // set background of the .apod-section to apod image
  const apodSection = document.querySelector('.apod-section')
  const imageUrl = "url('" + apodData.url + "')"
  apodSection.style.backgroundImage = imageUrl

  // Populate the image copyright, etc. info section
  let copyright = ''
  if (apodData.copyright) {
    copyright = apodData.copyright
  } else {
    copyright = 'no copyright'
  }
  const apodInfo = 'copyright: ' + copyright + ' | title: ' + apodData.title
  document.querySelector('.copyright-string').textContent = apodInfo
}

// Populate the mission information in the carousel.
displayLaunchDetail = displayLaunchIndex => {
  if (upcomingLaunches.length > 0) {
    currentLaunchIndex = displayLaunchIndex
    document.querySelector('.mission-title-span').textContent =
      upcomingLaunches[displayLaunchIndex].title
    if (upcomingLaunches[displayLaunchIndex].description) {
      document.querySelector('.mission-description-span').textContent =
        upcomingLaunches[displayLaunchIndex].description
    } else {
      document.querySelector('.mission-description-span').textContent =
        'No description available yet.'
    }
    countDown(upcomingLaunches[displayLaunchIndex].launchDate)
    document.querySelector('.mission-location-span').textContent =
      upcomingLaunches[displayLaunchIndex].location
  }

  // Execute the auto change function
  autoChange()
}

// Display the next launch if the right button is clicked.
const nextLaunch = () => {
  if (currentLaunchIndex < upcomingLaunches.length - 1) {
    displayLaunchDetail(currentLaunchIndex + 1)
  } else {
    displayLaunchDetail(0)
  }
}

// Display the prior launch if the left button is clicked.
const previousLaunch = () => {
  if (currentLaunchIndex > 0) {
    displayLaunchDetail(currentLaunchIndex - 1)
  } else {
    displayLaunchDetail(upcomingLaunches.length - 1)
  }
}

// Create count down timer
const countDown = countDownDate => {
  clearInterval(countDownIntervalID)
  clearInterval(autoChangeIntervalID)
  countDownIntervalID = setInterval(() => {
    // Get current date and time
    const now = new Date().getTime()

    // Get the difference between launch date and current date time
    const difference = countDownDate - now

    // If the difference is zero or less, display launched.apod-section
    let currentCountDown = ''
    if (difference <= 0) {
      currentCountDown = 'Launched!'
      clearInterval(countDownIntervalID)
    } else {
      // Calculate days, hours, minutes and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      var hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = Math.floor((difference % (1000 * 60)) / 1000)

      currentCountDown =
        days +
        ' days, ' +
        hours +
        ' hours, ' +
        minutes +
        ' mins, ' +
        seconds +
        ' seconds'
    }
    document.querySelector(
      '.mission-countdown-span'
    ).textContent = currentCountDown
  }, 1000)
}

// Change carousel automatically every 10 seconds
const autoChange = () => {
  clearInterval(autoChangeIntervalID)
  autoChangeIntervalID = setInterval(() => {
    nextLaunch()
  }, 10000)
}

// Start Listening
document.addEventListener('DOMContentLoaded', main)
document
  .querySelector('.right-carousel-btn')
  .addEventListener('click', nextLaunch)
document
  .querySelector('.left-carousel-btn')
  .addEventListener('click', previousLaunch)
