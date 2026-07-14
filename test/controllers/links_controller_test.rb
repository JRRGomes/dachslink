require "test_helper"

class LinksControllerTest < ActionDispatch::IntegrationTest
  test "index renders the shorten form" do
    get root_url
    assert_response :success
    assert_select "form"
  end

  test "creates a link and redirects with the short url in the flash" do
    assert_difference "Link.count", 1 do
      post links_url, params: { link: { original_url: "https://example.com/page" } }
    end

    assert_redirected_to root_url
    assert_includes flash[:short_url], Link.last.slug
  end

  test "does not create a link for an invalid url and re-renders with 422" do
    assert_no_difference "Link.count" do
      post links_url, params: { link: { original_url: "not-a-url" } }
    end

    assert_response :unprocessable_entity
  end

  test "visiting a known slug redirects to the original url" do
    link = links(:rails_guide)

    get "/#{link.slug}"

    assert_redirected_to link.original_url
  end

  test "visiting an unknown slug returns 404" do
    get "/does-not-exist"
    assert_response :not_found
  end
end
