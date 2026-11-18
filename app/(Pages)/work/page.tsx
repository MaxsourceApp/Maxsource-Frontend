import WorkProjects from "../../components/work/WorkProjects";
import WordPressPageLayout from "../../components/common/WordPressPageLayout";
import { getProjects } from "../../lib/projects";

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <WordPressPageLayout slug="work">
      <WorkProjects projects={projects} />
    </WordPressPageLayout>
  );
}
