set :stage, :production

role :app, %w{realestate.devshoplabs.com}
role :web, %w{realestate.devshoplabs.com}
role :db,  %w{realestate.devshoplabs.com}

server 'realestate.devshoplabs.com',
    user: 'railsapps',
    roles: %w{web app},
    ssh_options: {
        user: 'railsapps', # overrides user setting above
        keys: %w(/home/railsapps/.ssh/id_rsa),
        forward_agent: false,
        auth_methods: %w(password),
        password: '123'
    }