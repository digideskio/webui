var React = require('react')

var ObjectView = React.createClass({
  displayName: 'ObjectView',
  propTypes: {
    path: React.PropTypes.string,
    gateway: React.PropTypes.string,
    object: React.PropTypes.object,
    handleBack: React.PropTypes.func
  },
  render: function () {
    var size = this.props.object.Data.length - 2
    var data = 'data:text/plain;charset=utf8;base64,' + new Buffer(this.props.object.Data.substr(0, 10000), 'utf-8').toString('base64')

    var back = null
    var withoutPrefix = this.props.path.replace(/^\/ip[fn]s\//, '')
    var slashIndex = withoutPrefix.indexOf('/')
    if (slashIndex !== -1 && slashIndex !== withoutPrefix.length - 1) {
      back = (
        <div>
          <button className='btn btn-primary' onClick={this.props.handleBack}>
            <i className='fa fa-arrow-left'></i> Back to parent object
          </button>
        </div>
      )
    }

    var links = <div className='padded'><span>This object has no links</span></div>
    if (this.props.object.Links.length > 0) {
      links = (
        <div className='table-responsive'>
          <table className='table table-hover filelist'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Hash</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
            {this.props.object.Links.map(function (link) {
              var path = window.location.hash
              if (link.Name) {
                path += '\\' + link.Name
              } else {
                var split = path.split('/')
                split[split.length - 1] = link.Hash
                path = split.join('/')
              }

              return (
                <tr>
                  <td><a href={path} data-name={link.Name} data-hash={link.Hash}>{link.Name}</a></td>
                  <td><a href={path} data-name={link.Name} data-hash={link.Hash}>{link.Hash}</a></td>
                  <td>{link.Size}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      )
    }

    var obj = this.props.object

    var resolved = obj.Resolved ?
      <div>
        <h4>IPFS Permalink</h4>
        <div className='panel panel-default'>
          <div className='padded'>
            <a href={obj.Resolved.urlify()}>
              {obj.Resolved.toString()}
            </a>
          </div>
        </div>
      </div>
      : null

    var displayData = size ?
      <div>
        <h4>Data <span className='small'>({size} bytes)</span></h4>
        <div className='panel panel-default data'>
          <iframe src={data} className='panel-inner'></iframe>
        </div>
      </div>
      :
      <div>
        <h4>Data</h4>
        <div className='padded panel panel-default'>
          <span>This object has no data</span>
        </div>
      </div>

    return (
      <div className='webui-object'>
        <div className='row'>
          {back}
          <h4>Links</h4>
          <div className='link-buttons'>
            <a href={this.props.gateway + this.props.path} target='_blank' className='btn btn-info'>RAW</a>
            <a href={this.props.gateway + this.props.path + '?dl=1'} target='_blank' className='btn btn-second'>Download</a>
            <button className='btn btn-third hidden'><i className='fa fa-lg fa-thumb-tack'></i></button>
          </div>
          <br/>
          <div className='panel panel-default'>
            {links}
          </div>
        </div>
        <br/>
        <div className='row'>
          {displayData}
          {resolved}
        </div>
      </div>
    )
  }
})

module.exports = ObjectView
