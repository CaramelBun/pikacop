module.exports = (client) => {
    console.log(`${client.user.tag} is online!`);
    setInterval(() => {
        var arrayOfStatus = [
            `experiments`
          ]
          
          client.user.setStatus('online')
          client.user.setActivity(
              `${arrayOfStatus[Math.floor(Math.random() * arrayOfStatus.length)]}`,
              {type: 'WATCHING'}
          )
    }, 30000);
}