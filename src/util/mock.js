import Mock from 'mockjs'
Mock.Random.extend({
  constellations: ['Green', 'Yellow', 'Red'],
  constellation: function (date) {
    return this.pick(this.constellations)
  }
})

export default [
  // Mock.mock('http://localhost:8080/list', 'get', {
  Mock.mock(/http:\/\/localhost:8080\/cluster_list/, 'get', {
    'tableData|10': [{
      'id|+1': 1,
      'server_name_id': {
        'server_name': '@domain',
        'server_id': '@natural()'
      },
      'cluster_name': '@domain',
      'cluster_id': '@natural()',
      'status': '@CONSTELLATION',
      'addr': '@word',
      'node_number|10000-65535': 0,
      'init_time': '@datetime',
      'docker_version': '@CONSTELLATION'
    }],
    'Total': 50
  }),
  Mock.mock(/http:\/\/localhost:8080\/services_list/, 'get', {
    'tableData|10': [{
      'service_vip': '@natural()',
      'service_name': '@name',
      'service_id': '@natural()',
      'cluster_id': '@natural()',
      'cluster_name': '@name',
      'replicates|0-10': 1,
      'address': '@county',
      'zip': '@zip',
      'test1': '@word'
    }],
    'Total': 50
  }),
  Mock.mock('http://localhost:8080/SignIn', 'post', {
    'SignIn': 'true'
  }),
  Mock.mock('http://192.168.1.129:5000/login', 'post',
    'success'
),
  Mock.mock('http://localhost:8080/add_server', 'post', {
    'data': 'true'
  }),
  Mock.mock('http://localhost:8080/exe/init', 'post', {
    'data': 'true'
  }),
  Mock.mock('http://localhost:8080/update', 'post', {
    'data': 'true'
  }),
  Mock.mock('http://192.168.1.129:5000/services_name', 'post', {
    'data': 'true'
  })
]
