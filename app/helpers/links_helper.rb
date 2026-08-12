module LinksHelper
  def short_link_parts(link)
    uri = URI.parse(short_url(link.slug))
    host = [ 80, 443 ].include?(uri.port) ? uri.host : "#{uri.host}:#{uri.port}"

    [ host, uri.path ]
  end
end
