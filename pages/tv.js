import Head from 'next/head'
import React from 'react'
import axios from 'axios';
import { createStore } from 'redux'
import { useState } from 'react';
import { useRouter } from 'next/router'
import Carousel from 'react-elastic-carousel';
import Modal from './modal';
import Destaque from './Dashboard'
import Carrousel from './CarroselTv'

var randomPage = Math.floor(Math.random() * 20) + 1


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animes: null,
      atualSlide: 0,
      animeDestaque: null,
      searchParam: "",
      searchParamEnter: "",
      searchResult: null,
      vendoAnime: null,
      vendoModal: false,
      loadingAnimes: true,
      fakeLoading: [0,0,0,0,0,0,0,0,0,0],
      animesFavoritos: [],
      carregandoModal: false,
      showSearch: 0,
      carrouselIndex: 0,
      carrouselA: [
        {
            titulo: "Lançamentos do Dia",
            url: "launchDay",
            scroll: 0
        },
        {
            titulo: "Animes mais vistos",
            url: "",
            scroll: 0
        },
        {
            titulo: "Animes Aleatórios",
            url: `${Math.floor(Math.random() * 144)}/A/-_-`,
            scroll: 0
        },
        {
            titulo: "Tudo sobre Naruto",
            url: `1/naruto/-_-`,
            scroll: 0
        },
        {
            titulo: "Tudo sobre Dragon Ball",
            url: `1/dragon ball/-_-`,
            scroll: 0
        },
        {
            titulo: "Aventura",
            url: `1/aventura/-_-`,
            scroll: 0
        }
        ]
    };
  }
  componentDidMount(){
    const aKeyT = new Audio('./audio/same-light.mp3');
    window.addEventListener(`keyup`, e => {
      if(e.key == 'ArrowDown'){
        if(this.state.carrouselIndex < this.state.carrouselA.length - 1){
          aKeyT.play()
          setTimeout(() => {
            this.setState({ carrouselIndex: this.state.carrouselIndex + 1 })
          }, 100);
          
        }
      }
      if(e.key == 'ArrowUp'){
        if(this.state.carrouselIndex > 0){
          aKeyT.play()
          setTimeout(() => {
          this.setState({ carrouselIndex: this.state.carrouselIndex - 1 })
          }, 100);
        }
      }
    })
  }
  async submitForm(e){
    e.preventDefault()
    if(this.state.searchParam.trim().length > 0){
      this.setState({ searchParamEnter: document.querySelector("#inputAnime").value })
      const react = this
      try {
        const res = await axios.get(`http://167.114.82.198:3333/1/${react.state.searchParam}/-_-`);
        const json = res.data
        setTimeout(() => {
          react.setState({ searchResult: json })
        }, 500);
        document.querySelector("body").scroll({top: 0, left: 0, behavior: 'smooth'});
      } catch (error) {
        console.log(`error`)
        return { error };
      }
    }
  }
  async submitFormDigitar(){
    if(this.state.searchParam.trim().length > 0){
      this.setState({searchParam: document.querySelector("#inputAnime").value})
      this.setState({ searchParamEnter: document.querySelector("#inputAnime").value })
      const react = this
      try {
        const res = await axios.get(`http://167.114.82.198:3333/1/${react.state.searchParam}/-_-`);
        const json = res.data
        react.setState({ searchResult: json })
      } catch (error) {
        console.log(`error`)
        return { error };
      }
    }
  }
  async getAnime(animeID, link) {
    this.setState({vendoAnime: null})
    this.setState({vendoModal: true})
    this.setState({carregandoModal: true})
    document.querySelector('html').style.overflowY = "hidden"
    try {
      const res = await axios.get(`http://167.114.82.198:3333/anime/${animeID}`);
      const json = res.data
      this.setState({vendoAnime: json})
      this.setState({carregandoModal: false})
      
    } catch (error) {
      console.log(`error`)
      return { error };
    }
  }
  searchAnime(){
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
  }
  sairModal(){
    this.setState({vendoModal: false})
    document.querySelector('html').style.overflowY = "auto"
  }
  addFavorite(anime){
    try {
      var atual = window.localStorage.getItem('favorite') != null ? JSON.parse(window.localStorage.getItem('favorite')) : []
      if(!JSON.parse(window.localStorage.getItem('favorite')).find(e => e.idAnime == anime.idAnime) || window.localStorage.getItem('favorite') == null){
        atual.push(anime)
        window.localStorage.setItem('favorite', JSON.stringify(atual))
      } else{
        const id = atual.indexOf(JSON.parse(window.localStorage.getItem('favorite')).find(e => e.idAnime == anime.idAnime))
        atual.splice(id, 1)
        window.localStorage.setItem('favorite', JSON.stringify(atual))
      }
      
    } catch (error) {
      
    }
  }
  render() {
    return <div className="container">
    <Head>
      <title>NekoWatch</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
    </Head>
    <div>
      <div className="background"/>
      { this.state.carregandoModal && <div className="openAnimeBa">
      <i className="fas fa-spinner"></i>
      </div> }
      { this.state.vendoAnime != null && this.state.vendoModal && <Modal 
      home={this}
      anime={this.state.vendoAnime}></Modal> }
    </div>
    <div className="fixedTop">
      <form onSubmit={(e) => this.submitForm(e)}>
        <input 
        autoComplete={"off"}
        id="inputAnime"
        onKeyUp={() => this.setState({searchParam: document.querySelector("#inputAnime").value})}
        type="text" placeholder="Buscar animes..."></input>
        <button></button>
      </form>
    </div>
    <br/><br/><br/>
    <div>
      { this.state.searchResult !== null && this.state.searchResult.animes.length
      && this.state.searchParam.trim().length > 0 && this.state.searchParamEnter.toLowerCase() == this.state.searchParam.toLowerCase()
      &&
      <div className="scrollAnime"
      >
        <h1 className="title">Resultados para { this.state.searchParamEnter }</h1>
        <div className="info">
          <div
          className="scroller"
          style={{
            width: `${this.state.searchResult.animes.length * 300}px`
          }}
          >
            <div
            className="animation"
            style={{
              transform: `translateX(-${this.state.showSearch * 263}px)`
            }}
            >
            { this.state.searchResult.animes.map((anime, i) => (
              <div 
              onClick={() => this.getAnime(anime.idAnime, anime.animeLink)}
              key={anime.idAnime}
              onTouchEnd={(e) => {
                const left = ( (e.changedTouches[0].clientX + 200) - window.innerWidth) > 0
                if(!left){
                  if((i + 1) < this.state.searchResult.animes.length){
                    this.setState({showSearch: i + 1})
                  } else{
                    this.setState({showSearch: 0})
                  }
                } else{
                  if((i) > 0){
                    this.setState({showSearch: i - 1})
                  } else{
                    this.setState({showSearch: this.state.searchResult.animes.length - 1})
                  }
                }
              }}
              className={`animeTile ${(i == this.state.showSearch ? `ativoHover`: ``)}`}>
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
              if(this.state.searchResult.animes.length >= this.state.showSearch + 2){
                this.setState({showSearch: this.state.showSearch += 1})
              } else{
                this.setState({showSearch: 0})
              }
            }
            }
            className="right">
              <div className="blur"/>
              <i className="fas fa-chevron-right icon"></i>
            </div>
            <div className="left"
            onClick={() => {
              if(this.state.showSearch + this.state.searchResult.animes.length > this.state.searchResult.animes.length ){
                this.setState({showSearch: this.state.showSearch -= 1})
              } else{
                this.setState({showSearch: this.state.animes.length - 1})
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
     <div className="scrollAnime animation" 
     style={{
      transform: `translateY(-${this.state.carrouselIndex * 212}px)`
    }}>
       { this.state.carrouselA.map((item, i) => (
        <Carrousel
        home={this}
        titulo={item.titulo}
        url={item.url}
        in={i}
        tv={true}
        carrouselIndex={this.state.carrouselIndex}
        />
       ))}
      </div>
      <br/><br/><br/><br/><br/><br/><br/><br/>
      <h1 style={{
        color: "white",
        fontSize: "18px",
        padding: "2em",
        marginLeft: `30px`,
        maxWidth: `80%`
       }}>
        Todos os textos, imagens, gráficos, animações, vídeos, músicas, sons e outros materiais são protegidos por direitos autorais e outros direitos de propriedade intelectual pertencentes à <a 
        style={{ color: `#734ea8` }}
        href="https://www.anitube.site/"
        target="_blank"
        >Anitube</a>, suas subsidiárias, afiliadas e licenciantes.
      </h1>
    </div>
    

    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
          Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
          sans-serif;
        user-select: none;
        padding-bottom: 5vh;
        background-color: rgb(26, 29, 41);
        overflow: hidden !important;
      }

      ::-webkit-scrollbar {
        background: transparent;
        height: 8px;
        width: 8px;
      }
    
      ::-webkit-scrollbar-thumb {
          border: none;
          -webkit-box-shadow: none;
          box-shadow: none;
          background: #734ea8;
          -webkit-border-radius: 8px;
          border-radius: 8px;
          min-height: 40px;
      }
      
      .background{
        background-color: rgb(26, 29, 41);
        position: fixed;
        height: 100vh;
        right: 8px;
        top: 0px;
        transition: opacity 200ms ease 0s;
        width: 100%;
        z-index: -3;
      }

      .background::after{
        background: url('./images/background.png') center center / cover no-repeat fixed;
        content: "";
        position: absolute;
        inset: 0px;
        opacity: 1;
        transition: opacity 500ms ease 0s;
      }

      .searchResult{
        top: -6vh;
        position: relative;
        left: -55px;
        transform: scale(0.98);
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

      .fixedLeft .logo{
        position: absolute;
        width: 100px;
        height: 100px;
        right: 0px;
        float: right;
      }

      .fixedLeft p{
        display: inline-flex;
      }

      .fixedLeft .logo img{
        position: absolute;
        width: 100px;
        transform: rotate(270deg) translateY(53px);
        transition: 0.4s;
      }

      .fixedLeft .logo img:hover{
        transform: rotate(270deg) translateY(0px);
      }

      .FixadoLeft{
        width: 421px !important;
      }

      .fixedLeftNot{
        width: 90px !important;
      }

      .fixedLeft{
        position: fixed;
        top: 0px;
        left: 0px;
        width: 90px;
        height: 100%;
        background: #181818;
        overflow: hidden;
        z-index: 10;
        box-shadow: 1px 2px 1px rgb(47 43 43 / 41%);
      }

      .fixedLeft li{
        list-style: none;
        color: white;
        padding: 10px;
        font-size: 180%;
        position: relative;
        top: 100px;
      }

      .dontFixado li span i{
        position: relative;
        left: -50px !important;
      }

      .dontFixado li p{
        display: none;
      }

      .fixedLeftNot li i{
        display: block;
        position: relative;
        left: 10px !important;
      }

      .fixedLeft li span{
        margin-left: 70px;
      }

      .fixedLeft li span i{
        position: relative;
        left: -20px;
      }

      .fixedLeft .ativo{
        background: white;
        color: #181818;
      }

      .fixedTop{
        position: fixed;
        right: 60px;
        z-index: 1000;
        top: 40px;
      }

      .fixedTop button{
        display: none;
      }

      form{
        background-color: rgb(17 19 28);
        width: 100%;
        position: fixed;
        left: 0px;
        top: 0px;
        padding: 10px;
      }

      .fixedTop input{
        border: none;
        color: #fff;
        padding: 8px;
        border-radius: 4px;
        background: rgba(0,0,0,.80);
        font-size: 20px;
        float: right;
        right: 30px;
        position: relative;
        outline: none;
      }

      .fixedTop input:focus{
        border-bottom: 2px solid #673ab7;
      }

      .rec-dot{
        box-shadow: 0 0 1px 2px rgb(255 255 255 / 50%) !important; 
      }

      .rec-dot_active{
        box-shadow: 0 0 1px 3px rgb(103 58 183) !important;
      }

      .openAnimeBa{
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.50);
        z-index: 200;
        top: 0px;
        left: 0px;
      }

      .openAnimeBa i{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 500%;
        animation: 1s loding infinite;
        color: white;
      }

      
      .title{
        font-size: 1.8rem;
        color: white;
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

      @keyframes loding{
        0%{
          transform: translate(-50%, -50%) rotate(0deg);
        }
        100%{
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }


    `}</style>
  </div>
  }
}

export default Home
