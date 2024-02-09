module.exports = {
    Username: process.env.OXYLABS_USER,
    Password: process.env.OXYLABS_PASSWORD,
    Timeout: 5,
    RequestsRate: 10,
    RetriesNum: 3,
    UrlListName: 'url_list_residential.txt',
    ProxyAddress: 'pr.oxylabs.io:7777',
};
