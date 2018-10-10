class Users {
  constructor({
    userId = '',
    userName = 'Henix',
    passward = '',
    phone = '',
    wechatId = ''
  }) {
    this.userId = userId;
    this.userName = userName;
    this.passward = passward;
    this.phone = phone;
    this.wechatId = wechatId;
  }
}

export default Users;
