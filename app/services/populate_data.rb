class PopulateData

  def self.pull_from_json
    json = File.read("#{Rails.root}/public/wp_posts.json")
    binding.pry
    content = JSON.parse(json)
    binding.pry
  end
end
