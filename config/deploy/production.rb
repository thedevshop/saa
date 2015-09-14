set :stage, :production

role :app, %w{mvp.studyabroadapartments.com}
role :web, %w{mvp.studyabroadapartments.com}
role :db,  %w{mvp.studyabroadapartments.com}

server 'mvp.studyabroadapartments.com',
    user: 'railsapps',
    roles: %w{web app},
    ssh_options: {
        user: 'railsapps', # overrides user setting above
        keys: %w(/home/railsapps/.ssh/id_rsa),
        forward_agent: false,
        auth_methods: %w(password),
        password: 'pejeebg3'
    }
