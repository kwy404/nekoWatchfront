import Head from 'next/head'
import React from 'react'
import axios from 'axios';
import Carousel from 'react-elastic-carousel';
import Modal from './modal';

class Carrousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animes: null,
      vendoAnime: null,
      vendoModal: false,
      loadingAnimes: true,
      fakeLoading: [0,0,0,0,0,0,0,0,0,0],
      width: 1920,
      toShow: 8,
      show: 0,
      mobile: false,
      mouseUp: 0
    };
    this.getAnime= this.getAnime.bind(this);
    this.changeView= this.changeView.bind(this);
  }
  componentDidMount(){
    this.setState({animes: []})
    this.getAnimes()
    this.setState({width: window.innerWidth})
    this.changeView()
    window.addEventListener('resize', () => {
      this.setState({width: window.innerWidth})
      this.changeView()
    })
  }
  changeView(){
    if(this.state.width > 1920){
      this.setState({toShow: 8})
    } else if(this.state.width >= 1720 && this.state.width <= 1920){
      this.setState({toShow: 8})
      this.setState({mobile: false})
    } else if(this.state.width >= 1496 && this.state.width <= 1720){
      this.setState({toShow: 7})
      this.setState({mobile: false})
    } else if(this.state.width >= 1496 && this.state.width <= 1720){
      this.setState({toShow: 6})
      this.setState({mobile: false})
    } else if(this.state.width >= 1362 && this.state.width <= 1496){
      this.setState({toShow: 6})
      this.setState({mobile: false})
    } else if(this.state.width >= 979 && this.state.width <= 1362){
      this.setState({toShow: 5})
      this.setState({mobile: false})
    } else if(this.state.width >= 803 && this.state.width <= 979){
      this.setState({toShow: 4})
      this.setState({mobile: false})
    } else if(this.state.width >= 803 && this.state.width <= 803){
      this.setState({toShow: 3})
      this.setState({mobile: false})
    } else{
      this.setState({toShow: 2})
      this.setState({mobile: true})
    }
  }
  async getAnimes() {
    const react = this
    try {
      const res = await axios.get(`https://nekowatchapi1.herokuapp.com/${react.props.url}`);
      const json = res.data
      if(react.props.type != undefined && react.props.type == 'search'){
        react.setState({animes: json})
      }else{
        react.setState({animes: json.animes})
      }
      react.setState({loadingAnimes: false})
    } catch (error) {
      console.error(`Erro fetchin url [ ${react.props.url} ]`)
      return { error };
    }
  }
  async getAnime(animeID, link) {
    this.props.home.setState({vendoAnime: null})
    this.props.home.setState({vendoModal: true})
    this.props.home.setState({carregandoModal: true})
    document.querySelector('html').style.overflowY = "hidden"
    const react = this
    try {
      const res = await axios.get(`https://nekowatchapi1.herokuapp.com/anime/${animeID}`);
      const json = res.data
      react.props.home.setState({vendoAnime: json})
      react.props.home.setState({carregandoModal: false})
      
    } catch (error) {
      console.log(`error`)
      return { error };
    }
  }
  render() {
    return <div className="container">
    { this.state.vendoModal && this.state.vendoAnime != null &&
    <div>
    
    <Modal 
      home={this}
      anime={this.state.vendoAnime}></Modal>
    </div>
    }
    { this.state.animes != null && this.state.animes.length > 0 &&
    <div className="scrollAnime"
    >
      <h1 className="title">{ this.props.titulo }</h1>
      <div className="info">
        <div
        className="scroller"
        style={{
          width: `${this.state.animes.length * 300}px`
        }}
        >
          <div
          className="animation"
          style={{
            transform: `translateX(-${(this.state.show * 263)}px)`
          }}
          >
          { this.state.animes.map((anime, i) => (
            <div
            
            onClick={() => this.getAnime(anime.idAnime, anime.animeLink)}
            key={anime.idAnime}
            onTouchEnd={(e) => {
              const left = ( e.changedTouches[0].clientX - window.innerWidth) > 0
              if(left){
                if((i + 1) < this.state.animes.length){
                  this.setState({show: i + 1})
                }
              } else{
                if((i - 1) > 0){
                  this.setState({show: i - 1})
                } else{
                  this.setState({show: this.state.animes.length - 1})
                }
              }
            }}
            className={`animeTile ${(i == this.state.show ? `ativoHover`: ``)}`}>
              <img src={anime.imagemAnime}/>  
              <div className="hover">
                <p>
                  { anime.nomeAnime }
                </p>
              </div>
            </div>
          ))}
          </div>
        </div>
        <div className="icons">
          <div 
          onClick={() => {
            if(this.state.animes.length >= this.state.show + 2){
              this.setState({show: this.state.show += 1})
            } else{
              this.setState({show: 0})
            }
          }
          }
          className="right">
            <div className="blur"/>
            <i className="fas fa-chevron-right icon"></i>
          </div>
          <div className="left"
          onClick={() => {
            if(this.state.show + this.state.animes.length > this.state.animes.length ){
              this.setState({show: this.state.show -= 1})
            } else{
              this.setState({show: this.state.animes.length - 1})
            }
          }
          }
          >
          <div className="blur"/>
          <i className="fas fa-chevron-left icon"></i>
          </div>
        </div>
      </div>

    </div>
    }
    

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
        padding-bottom: 5vh;
      }

      .fakeLoading{
        animation: 1.4s loadindFake infinite;
      }

      @keyframes loadindFake{
        0%{
          background: rgba(255,255,255,0.3)
        }
        0%{
          background: rgba(255,255,255,0.5)
        }
      }

      * {
        box-sizing: border-box;
      }

      @keyframes loding{
        0%{
          transform: translate(-50%, -50%) rotate(0deg);
        }
        100%{
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }

      .title{
        font-size: 1.8rem;
        color: #ffffffc9;
        margin-left: 2.2em;
        top: 1em;
        position: relative;
      }

      .animeTile{
        width: 240px;
        height: 140px;
        margin-left: 1.8em;
        display: inline-block;
        box-shadow: -1px 5px 11px 3px rgb(0 0 0 / 40%);
        transition: 0.4s;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        border-radius: 4px;
      }

      .ativoHover{
        box-shadow: -1px 5px 11px 3px rgb(0 0 0 / 80%);
        border: 3px solid white;
        transform: scale(1.1);
      }

      .ativoHover .hover{
        opacity: 1 !important;
      }

      .animeTile img{
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
      }

      .animeTile .hover{
        background: rgba(0,0,0,.60);
        position: absolute;
        top: 0px;
        height: 180px;
        width: 245px;
        opacity: 0;
        z-index: 2;
        transition: 0.4s;
      }

      .animeTile .hover:hover{
        opacity: 1;
      }
      
      .animeTile .hover p{
        color: white;
        text-overflow: ellipsis;
        width: 90%;
        left: 10px;
        font-size: 0.92em;
        top: 0px;
        position: relative;
      }

      .scroller{
        height: auto;
        padding: 30px;
      }

      .animation{
        transition: 0.4s;
      }

      .info{
        display: inline-block;
      }

      .info .right{
        position: absolute;
        right: 0px;
        width: 64px;
        height: 154px;
        margin-top: -190px;
        cursor: pointer;
      }

      .info .right .blur{
        filter: blur(11px) saturate(0.5);
        transform: scale(1.1);
        width: 64px;
        height: 180px;
        background: #0000007a;
      }

      .info .left{
        position: absolute;
        left: 0px;
        width: 64px;
        height: 154px;
        margin-top: -190px;
        cursor: pointer;
      }

      .info .icons:hover{
        opacity: 1;
      }

      .info .icon{
        color: white;
        font-size: 2em;
        z-index: 4;
        position: relative;
        top: -74%;
        left: 25px;
      }

      .info .left .blur{
        filter: blur(11px) saturate(0.5);
        transform: scale(1.1);
        width: 64px;
        height: 180px;
        background: #0000007a;
      }

    `}</style>
  </div>
  }
}

export default Carrousel