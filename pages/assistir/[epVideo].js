import Head from 'next/head'
import axios from 'axios';
import React from 'react'
import ReactNetflixPlayer from '../../player'

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anime: null,
      loadingPlayer: false
    };
  }
  componentDidMount(){
    this.getPlayer()
  }
  async getPlayer() {
    const epVideo = document.location.pathname.split('/')[2] 
    const react = this
    try {
      const res = await axios.get(`https://nekowatchapi1.herokuapp.com/video/${epVideo}`);
      const json = res.data
      react.setState({anime: json})
    } catch (error) {
      console.log(`error`)
      return { error };
    }
  }
  render() {
    return <div>
      <Head>
      <title>NekoWatch - Assistindo { this.state.anime != null ? this.state.anime.nomeAnime : 'carregando...' }</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
    </Head>
      <div>
        <div>
          {/* { !this.state.loadingPlayer && 
          <div className="preview">
            <i className="fas fa-spinner"></i>
          </div> } */}
          { this.state.anime != null && 
          <div className="player">
              <iframe 
              style={{
                position: `fixed`
              }}
              src={this.state.anime.video} frameborder="0" height="100%"
                                        scrolling="no" width="100%" allowFullScreen mozallowfullscreen msallowfullscreen
                                        oallowfullscreen webkitallowfullscreen></iframe>
          </div>
          }
        </div>
        
      </div>
    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
          Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
          sans-serif;
        background-color: #181818;
        user-select: none;
        overflow-y: auto;
        overflow-x: hidden;
      }

      * {
        box-sizing: border-box;
      }
    `}</style>
    </div>
  }
}


export default Video
