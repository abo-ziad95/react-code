import React, { useEffect, useMemo, useState} from 'react';
import PropTypes from "prop-types";
import {useHistory, useParams} from 'react-router-dom'

const Dropdown = ({match, name}) =>  {
  const item = localStorage.getItem(name)
  const [state, setState] = useState([]);
  const [selected, setSelected] = useState('');
  const history = useHistory();
  let { service_slug, brand_slug } = useParams();
  useEffect(() => {
    if(match) {
      const selected = match.split('-').splice(1, match.length).join('-')
      setState([{id: 1,label: item, slug: selected}])
      setSelected(selected)
    }
    fetch(`https://beta.autobooking.com/api/test/v1/search/${name}`).then(results => results.json())
      .then(data => setState([...data.data]))
  }, [])
  const optionChanged = (e) => {
    let path = 's-'
    if(service_slug) path = service_slug
    else if(service_slug && brand_slug) path = `${service_slug}/${brand_slug}`
    switch (name) {
      case 'terms':
        history.push(`/s-${e.target.value}`)
        break;
      case 'brands_terms':
        history.push(`/${path}/b-${e.target.value}`)
        break;
      case 'styles':
        history.push(`/${path}/st-${e.target.value}`)
        break;
    }
    setSelected(e.target.value)
    localStorage.setItem(name, state.find(item => item.slug === e.target.value).label)
  }
  return (
      <select onChange={optionChanged} value={selected} style={{width: '150px', margin: '10px'}}>
        {state.map( item => <option key={item.id} name={item.slug} value={item.slug}>{item.label}</option>)}
      </select>
  );
}

export default Dropdown;
Dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  match:  PropTypes.string
};
