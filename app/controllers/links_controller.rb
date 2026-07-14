class LinksController < ApplicationController
  def index
    @link = Link.new
  end

  def create
    @link = Link.new(link_params)

    if @link.save
      redirect_to root_path, flash: { short_url: short_url(@link.slug) }
    else
      render :index, status: :unprocessable_entity
    end
  end

  def visit
    link = Link.find_by!(slug: params[:slug])
    redirect_to link.original_url, allow_other_host: true
  end

  private

  def link_params
    params.require(:link).permit(:original_url)
  end
end
