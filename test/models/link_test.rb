require "test_helper"

class LinkTest < ActiveSupport::TestCase
  test "is valid with an http(s) url" do
    assert Link.new(original_url: "https://example.com").valid?
    assert Link.new(original_url: "http://example.com").valid?
  end

  test "is invalid without a url" do
    link = Link.new(original_url: nil)
    assert_not link.valid?
    assert_includes link.errors[:original_url], "can't be blank"
  end

  test "is invalid when the url has no http(s) scheme" do
    link = Link.new(original_url: "example.com")
    assert_not link.valid?
  end

  test "generates a slug automatically on create" do
    link = Link.create!(original_url: "https://example.com")
    assert_not_nil link.slug
    assert_equal 6, link.slug.length
  end

  test "gives two links different slugs" do
    a = Link.create!(original_url: "https://a.example.com")
    b = Link.create!(original_url: "https://b.example.com")
    assert_not_equal a.slug, b.slug
  end

  test "keeps the same slug when the record is updated" do
    link = Link.create!(original_url: "https://example.com")
    original_slug = link.slug

    link.update!(original_url: "https://changed.example.com")

    assert_equal original_slug, link.slug
  end

  test "rejects a duplicate slug" do
    existing = Link.create!(original_url: "https://example.com")
    duplicate = Link.new(original_url: "https://other.com", slug: existing.slug)

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:slug], "has already been taken"
  end
end
