import React from 'react';
import './news-card.css';
import {MdShare} from 'react-icons/md'
import { getBadgeBgForSection, getBadgeTxtClrForSection } from '../utils';

const NewsCard = (props) => {
  // console.log(props);
  return <div className="row shadow p-3 m-4 rounded card-border" style={{ cursor: "pointer" }}
    onClick={() => props.routerHistory.push(`/article?id=${props.id}`)}>
    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 p-0" >
      <img src={props.image} style={{ maxWidth: 100 + '%' }} />
    </div>

    <div className="col-lg-9 col-md-9 col-sm-6 col-xs-12 p-0 px-sm-2 mt-2 mt-sm-0">
      <h4 className="col-12 p-0 px-sm-2"> <i>{props.title} </i>
        <span className=""><MdShare onClick={(event) => { event.preventDefault(); event.stopPropagation(); props.onShare(props.title, props.webUrl) }} />
        </span>
      </h4>
      <p className="col-12 p-0 px-sm-2 line-clamp">{props.description}</p>
      <div className="col-12 p-0 px-sm-2">
        <i style={{ float: 'left' }}>{props.date}</i>
        {/* todo: add badge */}
        <span className="badge" style={{ float: "right", backgroundColor: getBadgeBgForSection(props.section), color: getBadgeTxtClrForSection(props.section) }}>{props.section.toUpperCase()}</span>
        <div style={{clear: 'both'}}/>
      </div>
    </div>
  </div>
}

export default NewsCard;