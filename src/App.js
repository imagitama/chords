import React from 'react'
import { connect } from 'react-redux'
import { Global } from '@emotion/core'
import { ThemeProvider } from 'emotion-theming'
import darkTheme from './themes/dark'
import lightTheme from './themes/light'
import chordsDefinition from './chords'
import Chords from './components/chords/chords'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import SearchInput from './components/search-input/search-input'
import SearchTerm from './components/search-term/search-term'
import OutputMessage from './components/output-message/output-message'
import { populateCopiedChords, filterMajorMinorChordsOnly, sortChordsBySequence, filterChordsByChordProgression, filterChordsBySearchTerm, filterFavouriteChordsOnly } from './filters'
import globalStyles from './globalStyles'
import WelcomeMessage from './components/welcome-message/welcome-message'
import FeedbackForm from './components/feedback-form/feedback-form'
import KeySongs from './components/key-songs/key-songs'
import Song from './components/song/song'

const ChordsContainer = ({ selectedKeyShortName, sortBySequence, selectedChordProgressionIdx, searchTerm, majorMinorChordsOnly, favouriteChords, favouritesOnly }) => {
  let chords = populateCopiedChords(chordsDefinition)

  if (majorMinorChordsOnly && !selectedKeyShortName) {
    chords = filterMajorMinorChordsOnly(chords)
  }

  if (selectedKeyShortName && sortBySequence) {
    chords = sortChordsBySequence(chords, selectedKeyShortName)
  }

  if (selectedKeyShortName && selectedChordProgressionIdx) {
    chords = filterChordsByChordProgression(chords, selectedKeyShortName, selectedChordProgressionIdx)
  }

  if (searchTerm) {
    chords = filterChordsBySearchTerm(chords, searchTerm)
  }

  if (favouritesOnly) {
    chords = filterFavouriteChordsOnly(chords, favouriteChords)
  }

  return (
    <>
      <SearchInput />
      <SearchTerm />
      {chords.length ? <Chords chords={chords} /> : <OutputMessage>No chords found</OutputMessage>}
      <KeySongs />
    </>
  )
}

const App = ({ isDarkModeEnabled, selectedSong, ...props }) => {
  return (
    <ThemeProvider theme={isDarkModeEnabled ? darkTheme : lightTheme}>
      <Global styles={globalStyles} />
      <Header />
      <WelcomeMessage />
      <FeedbackForm />
      {!selectedSong && <ChordsContainer {...props} />}
      <Song />
      <Footer />
    </ThemeProvider>
  )
}

const mapStateToProps =
  ({ 
    keys: {
      selectedKeyShortName,
      sortBySequence,
      selectedChordProgressionIdx
    },
    chords: {
      searchTerm,
      majorMinorChordsOnly,
      favouritesOnly,
      favouriteChords
    },
    app: {
      isDarkModeEnabled
    },
    songs: {
      selectedSong
    }
  }) =>
  ({ 
    selectedKeyShortName, 
    sortBySequence, 
    selectedChordProgressionIdx,
    searchTerm,
    majorMinorChordsOnly,
    favouriteChords,
    favouritesOnly,
    isDarkModeEnabled,
    selectedSong
  })

export default connect(mapStateToProps)(App)
